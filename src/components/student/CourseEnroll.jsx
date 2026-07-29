import { useState, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { REGISTRAR_URL } from '../../Constants';
import Messages from '../Messages';

const CourseEnroll = () => {

  // student adds a course to their schedule

  const [sections, setSections] = useState([]);
  const [message, setMessage] = useState('');

  const fetchSections = async () => {
    // get list of open sections for enrollment
    try {
      const response = await fetch(`${REGISTRAR_URL}/sections/open`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('jwt'),
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSections(data);
        setMessage('');
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  useEffect(() => {
    fetchSections();
  }, []);

  const addCourse = async (sectionNo) => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/enrollments/sections/${sectionNo}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('jwt'),
          },
        }
      );
      if (response.ok) {
        setMessage('Course added');
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  const onAdd = (sectionNo) => {
    confirmAlert({
      title: "Confirm to add",
      message: "Do you really want to add this course?",
      buttons: [
        {
          label: "Yes",
          onClick: () => addCourse(sectionNo),
        },
        {
          label: "No",
        },
      ],
    });
  }

  const headers = ['section No', 'year', 'semester', 'course Id', 'section', 'title', 'building', 'room', 'times', 'instructor', ''];

  return (
    <div>
      <Messages response={message} />
      <h3>Open Sections Available for Enrollment</h3>
      <table className="Center">
        <thead>
          <tr>
            {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
          </tr>
        </thead>
        <tbody>
          {sections.map((section) => (
            <tr key={section.secNo}>
              <td>{section.secNo}</td>
              <td>{section.year}</td>
              <td>{section.semester}</td>
              <td>{section.courseId}</td>
              <td>{section.secId}</td>
              <td>{section.title}</td>
              <td>{section.building}</td>
              <td>{section.room}</td>
              <td>{section.times}</td>
              <td>{section.instructorName}</td>
              <td><button onClick={() => onAdd(section.secNo)}>Add</button></td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default CourseEnroll;
