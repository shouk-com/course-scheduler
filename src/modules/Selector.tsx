import React from "react";
import { Course, CourseSection, Section } from "../services/datamod";

function Selector(props: {
    course: Course,
    chosenSections: CourseSection[],
    isLecture: boolean,
    sections: Section[],
    sectionUpdate: (courseOfSectionToBeUpdated: Course, chosenSections: CourseSection[], isLecture: boolean, value: string) => void
}) {
    return (
        <select
            defaultValue={props.sections[0].instructor + props.sections[0].timings.toLocaleString()}
            onChange={(e) => {
                props.sectionUpdate(
                    props.course,
                    props.chosenSections,
                    props.isLecture,
                    e.target.value)
            }}>
            {
                props.sections.map((section, key) => {
                    return <option
                        key={section.instructor + section.timings.toLocaleString() + key}
                        value={section.instructor + section.timings.toLocaleString()}>{section.secNumber}</option>
                })
            }</select>)
}
export default Selector;