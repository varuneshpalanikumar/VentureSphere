import { useEffect, useState } from "react";
import API from "../services/api";
import StartupCard from "./StartupCard";

function ProfessionalProjects() {

  const [projects, setProjects] = useState([]);

  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {

    fetchProjects();

  }, []);

  const fetchProjects = async () => {

    try {

      const res = await API.get(`/users/${user._id}/joined-projects`);

      setProjects(res.data);

    } catch (error) {

    }

  };

  if (projects.length === 0) {
    return (
      <p className="muted">
        You haven't joined any ventures yet.
      </p>
    );
  }

  return (

    <div className="grid grid-3">

      {projects.map((startup) => (
        <StartupCard key={startup._id} startup={startup} />
      ))}

    </div>

  );

}

export default ProfessionalProjects;