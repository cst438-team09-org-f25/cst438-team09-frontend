import { useState } from 'react';
import { Link } from "react-router-dom";
import { GRADEBOOK_URL } from '../../Constants';
import SelectTerm from '../SelectTerm';
import Messages from '../Messages';


const InstructorSectionsView = () => {

  const [sections, setSections] = useState([]);
  const [message, setMessage] = useState('');


  const fetchSections = async (term) => {

    try {
      const response = await fetch(`${GRADEBOOK_URL}/sections?year=${term.year}&semester=${term.semester}`,
        {
          method: 'GET',
          headers: {
            'Authorization': sessionStorage.getItem('jwt'),
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSections(data);
      } else {
        const rc = await response.json();
        setMessage(rc);
      }
    } catch (err) {
      setMessage(err);
    }
  }

  const headers = ['secNo', 'course id', 'sec id', 'building', 'room', 'times', '', ''];

  return (
    <>
      <SelectTerm onClick={fetchSections} buttonText="Get Sections" />
      <h3>Sections</h3>
      <Messages response={message} />
      <table className="Center" >
        <thead>
          <tr>
            {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
          </tr>
        </thead>
        <tbody>
          {sections.map((s) => (
            <tr key={s.secNo}>
              <td>{s.secNo}</td>
              <td>{s.courseId}</td>
              <td>{s.secId}</td>
              <td>{s.building}</td>
              <td>{s.room}</td>
              <td>{s.times}</td>
              <td><Link id="enrollmentsLink" to="/enrollments" state={s}>Enrollments</Link></td>
              <td><Link id="assignmentsLink" to="/assignments" state={s}>Assignments</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default InstructorSectionsView;
