from typing import List, Optional
from pydantic import BaseModel
from elasticsearch import Elasticsearch
from dotenv import load_dotenv
import os

load_dotenv()

es_client = Elasticsearch(
    str(os.getenv('ELASTICSEARCH_URL')),
    api_key=str(os.getenv('ELASTICSEARCH_API_KEY'))
)

es_index_name = "courses-index"
slides_index_name = "lecture-slides-index"

class CourseBase(BaseModel):
    course_id: str
    course_name: str

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseModel):
    course_id: Optional[str] = None
    course_name: Optional[str] = None

class CourseResponse(CourseBase):
    id: str
    
    class Config:
        from_attributes = True

class CourseService:
    def get_all_courses(self) -> List[CourseResponse]:
        """Get all courses"""
        try:
            if not es_client.indices.exists(index=es_index_name):
                return []
            
            response = es_client.search(
                index=es_index_name,
                body={
                    "query": {
                        "match_all": {}
                    }
                }
            )
            
            courses = []
            for hit in response['hits']['hits']:
                course_data = hit['_source']
                course_data['id'] = hit['_id']
                courses.append(CourseResponse(**course_data))
            return courses
        except Exception as e:
            raise Exception(f"Error fetching courses: {str(e)}")
    
    def get_course_by_id(self, course_id: str) -> Optional[CourseResponse]:
        """Get a specific course by course_id"""
        try:
            if not es_client.indices.exists(index=es_index_name):
                return None
                
            response = es_client.get(index=es_index_name, id=course_id)
            if response['found']:
                course_data = response['_source']
                course_data['id'] = response['_id']
                return CourseResponse(**course_data)
            return None
        except Exception as e:
            if 'NotFoundError' in str(type(e).__name__) or '404' in str(e):
                return None
            raise Exception(f"Error fetching course: {str(e)}")
    
    def create_course(self, course: CourseCreate) -> CourseResponse:
        """Create a new course"""
        try:
            existing = self.get_course_by_id(course.course_id)
            if existing:
                raise ValueError(f"Course with ID '{course.course_id}' already exists")
            
            # Ensure index exists
            if not es_client.indices.exists(index=es_index_name):
                es_client.indices.create(index=es_index_name)
                es_client.indices.put_mapping(
                    index=es_index_name,
                    body={
                        "properties": {
                            "course_id": {"type": "keyword"},
                            "course_name": {"type": "text"}
                        }
                    }
                )
            
            doc = {
                "course_id": course.course_id,
                "course_name": course.course_name
            }
            
            response = es_client.index(index=es_index_name, id=course.course_id, document=doc)
            print(f"Indexed course to ES: {response}")
            
            return CourseResponse(
                id=response['_id'],
                course_id=course.course_id,
                course_name=course.course_name
            )
        except ValueError:
            raise
        except Exception as e:
            print(f"Error creating course in ES: {str(e)}")
            raise Exception(f"Error creating course: {str(e)}")
    
    def update_course(self, course_id: str, course_update: CourseUpdate) -> Optional[CourseResponse]:
        """Update an existing course"""
        try:
            existing = self.get_course_by_id(course_id)
            if not existing:
                return None
            
            new_course_id = course_update.course_id if course_update.course_id else course_id
            new_course_name = course_update.course_name if course_update.course_name else existing.course_name
            
            print(f"Updating course: old_id={course_id}, new_id={new_course_id}, new_name={new_course_name}")
            
            # If course_id changed, update all slides first, then delete old and create new course
            if course_update.course_id and course_update.course_id != course_id:
                print(f"Course ID changed, updating slides")
                self._update_slides_course_id(course_id, new_course_id)
                
                # Delete old course document
                print(f"Deleting old course document: {course_id}")
                es_client.delete(index=es_index_name, id=course_id, ignore=[404])
            
            # Create/update course document with new ID
            print(f"Indexing course document: id={new_course_id}")
            es_client.index(
                index=es_index_name,
                id=new_course_id,
                document={
                    "course_id": new_course_id,
                    "course_name": new_course_name
                }
            )
            
            # Return the updated course directly
            return CourseResponse(
                id=new_course_id,
                course_id=new_course_id,
                course_name=new_course_name
            )
        except Exception as e:
            print(f"Error in update_course: {str(e)}")
            raise Exception(f"Error updating course: {str(e)}")
    
    def _update_slides_course_id(self, old_course_id: str, new_course_id: str) -> None:
        """Update all slides with old_course_id to new_course_id"""
        try:
            if not es_client.indices.exists(index=slides_index_name):
                print(f"Slides index does not exist")
                return
            
            print(f"Updating slides from course_id {old_course_id} to {new_course_id}")
            
            # Use update_by_query to update all matching documents
            response = es_client.update_by_query(
                index=slides_index_name,
                body={
                    "script": {
                        "source": "ctx._source.course_id = params.new_course_id",
                        "lang": "painless",
                        "params": {
                            "new_course_id": new_course_id
                        }
                    },
                    "query": {
                        "term": {
                            "course_id": old_course_id
                        }
                    }
                }
            )
            print(f"Update by query response: {response}")
        except Exception as e:
            print(f"Error updating slides course_id: {str(e)}")
    
    def delete_course(self, course_id: str) -> bool:
        """Delete a course"""
        try:
            existing = self.get_course_by_id(course_id)
            if not existing:
                return False
            
            print(f"Deleting course {course_id}, uncategorizing slides")
            # Set all slides with this course_id to empty string
            self._uncategorize_slides(course_id)
            
            # Delete the course
            es_client.delete(index=es_index_name, id=course_id)
            return True
        except Exception as e:
            if 'NotFoundError' in str(type(e).__name__) or '404' in str(e):
                return False
            raise Exception(f"Error deleting course: {str(e)}")
    
    def _uncategorize_slides(self, course_id: str) -> None:
        """Set all slides with course_id to empty string"""
        try:
            if not es_client.indices.exists(index=slides_index_name):
                print(f"Slides index does not exist")
                return
            
            print(f"Uncategorizing slides with course_id: {course_id}")
            response = es_client.update_by_query(
                index=slides_index_name,
                body={
                    "script": {
                        "source": "ctx._source.course_id = ''",
                        "lang": "painless"
                    },
                    "query": {
                        "term": {
                            "course_id": course_id
                        }
                    }
                }
            )
            print(f"Uncategorize response: {response}")
        except Exception as e:
            print(f"Error uncategorizing slides: {str(e)}")
    
    def get_courses_for_dropdown(self) -> List[dict]:
        """Get courses formatted for dropdown options"""
        try:
            courses = self.get_all_courses()
            return [
                {"id": course.course_id, "name": course.course_name}
                for course in courses
            ]
        except Exception as e:
            raise Exception(f"Error fetching courses for dropdown: {str(e)}")
