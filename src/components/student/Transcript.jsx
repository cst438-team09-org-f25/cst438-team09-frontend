import { useState, useEffect } from 'react';
import { REGISTRAR_URL } from '../../Constants';
import Messages from '../Messages';


const Transcript = () => {

  const [message, setMessage] = useState('');
  const [courses, setCourses] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/transcripts`,
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
        setCourses(data);
      } else {
        const body = await response.json();
        setMessage(body);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const headers = ['Year', 'Semester', 'CourseId', 'Section', 'Title', 'Credits', 'Grade'];

  return (
    <>
      <h3>Transcript</h3>
      <Messages response={message} />
      <table className="Center">
        <thead>
          <tr>
            {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.enrollmentId}>
              <td>{course.year}</td>
              <td>{course.semester}</td>
              <td>{course.courseId}</td>
              <td>{course.sectionId}</td>
              <td>{course.title}</td>
              <td>{course.credits}</td>
              <td>{course.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </>
  );
}

export default Transcript;
