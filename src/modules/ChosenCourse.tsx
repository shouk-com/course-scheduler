import React from "react";
import { Course, CourseSection } from "../services/datamod";
import Selector from "./Selector";

function ChosenCourse(props: {
    liKey: React.Key,
    course: Course,
    chosenCourses: Course[],
    chosenCourseSections: CourseSection[],
    onSectionUpdate: (courseOfSectionToBeUpdated: Course, chosenSections: CourseSection[], isLecture: boolean, value: string) => void
    onDeletion: (courseToBeRemoved: Course, chosenCourses: Course[], chosenCourseSections: CourseSection[]) => void
}) {
    return (<li key={props.liKey}>
        <div>
            <button className="delete-button" onClick={(event: { target: any; currentTarget: any; }) => {
                if (event.target !== event.currentTarget)
                    return;
                props.onDeletion(props.course, props.chosenCourses, props.chosenCourseSections)
            }}>.</button>{props.course.courseNumber + " - " + props.course.name}
            {
                (props.course.lectureSections) ? <Selector
                    course={props.course}
                    sections={props.course.lectureSections}
                    chosenSections={props.chosenCourseSections}
                    sectionUpdate={props.onSectionUpdate}
                    isLecture={true}
                ></Selector> : <div></div>
            }
            {
                (props.course.practicalSections) ? <Selector
                    course={props.course}
                    sections={props.course.practicalSections}
                    chosenSections={props.chosenCourseSections}
                    sectionUpdate={props.onSectionUpdate}
                    isLecture={false}
                ></Selector> : <div></div>
            }

        </div>

    </li >)
}

export default ChosenCourse;