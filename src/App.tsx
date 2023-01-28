import React, { useState } from 'react';
import './App.css';
import TimeTable from './modules/TimeTable';
import { Course, CourseSection } from './services/datamod';
import TTJSON from './db/tt.json'
import ChosenCourse from './modules/ChosenCourse';

function App() {
    const [chosenCourseSections, updateChosenCourseSections] = useState<CourseSection[]>([]);
    const [chosenCourses, updateChosenCourses] = useState<Course[]>([]);
    const [searchText, updateSearchText] = useState<string>("")

    function deleteChosenCourse(courseToBeRemoved: Course, chosenCourses: Course[], chosenCourseSections: CourseSection[]) {
        updateChosenCourses(chosenCourses.filter((course) => course.commonCode !== courseToBeRemoved.commonCode))
        updateChosenCourseSections(chosenCourseSections.filter((courseSection) => courseSection.course.commonCode !== courseToBeRemoved.commonCode))
    }
    function addChosenCourse(courseToBeAdded: Course, chosenCourses: Course[], chosenCourseSections: CourseSection[]) {
        updateChosenCourses([...chosenCourses, courseToBeAdded])
        updateChosenCourseSections([...chosenCourseSections, {
            course: courseToBeAdded,
            lectureIndex: 0,
            practicalIndex: 0
        }])
    }
    function sectionUpdate(courseOfSectionToBeUpdated: Course, chosenSections: CourseSection[], isLecture: boolean, value: string) {
        updateChosenCourseSections(
            chosenSections.map((courseSection) => {
                if (courseSection.course !== courseOfSectionToBeUpdated)
                    return courseSection
                return {
                    course: courseOfSectionToBeUpdated,
                    lectureIndex: isLecture ?
                        (courseOfSectionToBeUpdated.lectureSections ? courseOfSectionToBeUpdated.lectureSections.findIndex((a) => {
                            return a.instructor + a.timings.toLocaleString() === value
                        }) : 0)
                        : courseSection.lectureIndex,
                    practicalIndex: !isLecture ?
                        (courseOfSectionToBeUpdated.practicalSections ? courseOfSectionToBeUpdated.practicalSections.findIndex((a) => {
                            return a.instructor + a.timings.toLocaleString() === value
                        }) : 0)
                        : courseSection.lectureIndex
                }
            })
        )
    }
    return (
        <div className="App">
            <div id='selection-box'>
                <div id='choose-div'>
                    <nav>
                        <form id='searchbar'>
                            <input type="text" placeholder="Search" onChange={(e) => updateSearchText(e.target.value)} />
                        </form>
                        <ul id='all-courses' >
                            {
                                TTJSON.map((owo, key) => {
                                    if (chosenCourses.find((course) => owo.commonCode === course.commonCode) || !owo.courseNumber.includes(searchText))
                                        return;
                                    return (
                                        <li
                                            key={key}
                                            onClick={() => addChosenCourse(owo as Course, chosenCourses, chosenCourseSections)}
                                        >{owo.courseNumber + " - " + owo.name}</li>)
                                })
                            }
                        </ul>
                    </nav>
                </div>
                <div id='chosen-div'>
                    <nav>
                        Chosen Courses
                        <ul id='chosen-courses'>
                            {
                                chosenCourses.map((owo, key) => <ChosenCourse
                                    key={owo.courseNumber + key}
                                    liKey={key}
                                    course={owo}
                                    chosenCourses={chosenCourses}
                                    chosenCourseSections={chosenCourseSections}
                                    onSectionUpdate={sectionUpdate}
                                    onDeletion={deleteChosenCourse} ></ChosenCourse>)
                            }
                        </ul>
                    </nav>
                </div>


            </div>
            <div id='timetable-box'>
                <TimeTable
                    courses={chosenCourseSections}
                    chosenCourses={chosenCourses}></TimeTable>
            </div>

        </div>
    );
}

export default App;
