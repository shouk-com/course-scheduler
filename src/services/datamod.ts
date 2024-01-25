export interface CourseSection {
    course: Course,
    lectureIndex: number,
    practicalIndex: number
}

export interface Course {
    commonCode: number,
    name: string,
    courseNumber: string,
    hasPractical: boolean,
    lectureSections?: Section[],
    practicalSections?: Section[],
    examTimings?: ExamTimings
}

export interface ExamTimings {
    midsem?: string,
    compre?: string
}

export interface Section {
    secNumber: number,
    instructor: string,
    roomNumber: string,
    timings: number[][]
}

const COMMMONCODE = 0;
const COURSENUMBER = 1;
const COURSENAME = 2;
const LPU = 3;
const SECTIONNUMBER = 4;
const INSTRUCTOR = 5;
const ROOMNUMBER = 6;
const TIMINGS = 7;
const MIDSEM = 8;
const COMPRE = 9;

export function parseTTContent(data: string) {
    let lineWiseData = data.split('\n');
    let tableData: string[][] = [];
    for (let index = 1; index < lineWiseData.length; index++)
        tableData.push(lineWiseData[index].split(','));

    let Courses: Course[] = [];
    let currCourseIndex = 0;
    for (let index = 0; index < tableData.length; index++) {
        Courses.push({
            commonCode: parseInt(tableData[index][COMMMONCODE]),
            name: tableData[index][COURSENAME],
            courseNumber: tableData[index][COURSENUMBER],
            hasPractical: false,
        })
        console.log(index + 1);
        let lines = 1, sectionLineNumber = 1;
        let hasPractical = false, practicalLineNumber = 0;
        /**
         * Loop finds number of lines under current course and stores them in lines.
         * Loop also checks for practicals in the current course and stores the line
         * where practicals start.
         */
        for (let i = index + 1; i < tableData.length; i++) {
            if (tableData[i][COMMMONCODE].length != 0)
                break;
            lines++;
            if (tableData[i][COURSENAME].match("Practical")) {
                hasPractical = true;
                practicalLineNumber = lines;
            }
        }
        if (tableData[index][TIMINGS].length == 0 && index + 1 < tableData.length && tableData[index + 1][COMMMONCODE].length == 0)
            sectionLineNumber = 2;
        Courses[currCourseIndex].lectureSections =
            parseTTSections(
                tableData,
                index,
                (hasPractical) ? practicalLineNumber - 1 - ((sectionLineNumber == 2) ? 1 : 0) : lines,
                sectionLineNumber
            )

        if (hasPractical) {
            Courses[currCourseIndex].hasPractical = hasPractical;
            Courses[currCourseIndex].practicalSections =
                parseTTSections(
                    tableData,
                    index,
                    lines - practicalLineNumber + 1,
                    practicalLineNumber
                );
        }

        let examDates: ExamTimings = {};
        if (tableData[index][MIDSEM].length > 0) {
            examDates.midsem = tableData[index][MIDSEM];
        }
        if (tableData[index][COMPRE].length > 0) {
            examDates.compre = tableData[index][COMPRE];
        }
        if (examDates.compre !== undefined || examDates.midsem !== undefined) {
            Courses[currCourseIndex].examTimings = examDates;
        }

        currCourseIndex++;
        index = index + lines - 1;
    }
    return JSON.stringify(Courses);

}

function parseTTSections(tableData: string[][], index: number, lines: number, startline: number) {
    let Sections: Section[] = [];
    for (let i = index + startline - 1; i < index + startline + lines - 1; i++) {
        Sections.push({
            secNumber: parseInt(tableData[i][SECTIONNUMBER]),
            instructor: tableData[i][INSTRUCTOR],
            roomNumber: tableData[i][ROOMNUMBER],
            timings: stringTimingToNumbers(tableData[i][TIMINGS])
        });
    }
    return Sections;
}
function stringTimingToNumbers(stringTimes: string) {
    try {
        let times = stringTimes.split(" ");
        let timings: number[][] = [];
        for (var i: number = 0; i < 5; i++) {
            timings[i] = [];
        }
        times.forEach(time => {
            let a = time.split('');
            let isTh = time.startsWith('Th')
            if (isTh) {
                for (let i = 2; i < a.length; i++) {
                    timings[3].push(parseInt(a[i]));
                }
            }
            else {
                for (let i = 1; i < a.length; i++) {
                    timings[stringDayToindex(a[0])].push(parseInt(a[i]));
                }
            }
        });
        return timings;
    }
    catch (err) {
        console.error(err)
        return [];
    }

}
function stringDayToindex(day: string) {
    switch (day) {
        case 'M':
            return 0;
        case 'T':
            return 1;
        case 'W':
            return 2;
        case 'Th':
            return 3;
        case 'F':
            return 4;
    }
    return 0;
}