import React, { useContext, useState } from "react";
import itemContext, { jobContext } from "./store";
import jobs from "@/jobs";
import { useEffect } from "react";

export default function ItemContextProvider({ children }) {
  let { jobs } = useContext(jobContext);
  let [items, setItems] = useState(jobs);
  let [filteritems, setFilteritems] = useState(jobs);
  let [keyword, setKeyword] = useState([]);
  let [location, setLocation] = useState([]);
  let [jobtype, setJobtype] = useState([]);
  let [salary, setSalary] = useState("");
  const [user, setUser] = useState(() => {
    // Get the user data from localStorage (if it exists)
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null; // If data exists, use it; otherwise, set to null
  });
  useEffect(() => {
    // const storedUser = JSON.parse(localStorage.getItem("user"));

    // if (storedUser) {
    //   // If the user data is found in localStorage, set it to the state
    //   setUser(storedUser);
    // }
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/verify", {
          withCredentials: true,
        });
        // If the response is successful, set the user
        setUser(response.data);
      } catch (err) {
        // setError("Error fetching user data");
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  function applyfilter(keyword, location) {
    console.log(keyword, location);
    let searchItem = jobs.filter((item) => {
      let title = item.title.toLowerCase().includes(keyword.toLowerCase());

      let loc = item.location.toLowerCase().includes(location.toLowerCase());

      return title && loc;
    });
    setFilteritems(searchItem);
  }

  function filterfunc() {
    let newitem = items.filter((item) => {
      let jobtypeMatch = jobtype.length
        ? jobtype.includes(item.employmentType)
        : true;
      let locationMatch = location.length
        ? location.includes(item.location)
        : true;

      let salaryMatch = salary ? item.salary > salary : true;

      let keywordMatch1 = keyword.length
        ? keyword.some((el) => item.keyword.includes(el))
        : true;
      return jobtypeMatch && salaryMatch && locationMatch && keywordMatch1;
    });
    setFilteritems(newitem);
  }

  return (
    <itemContext.Provider
      value={{
        user,
        setUser,
        items,
        setItems,
        filteritems,
        setFilteritems,
        applyfilter,
        keyword,
        setKeyword,
        location,
        setLocation,
        jobtype,
        setJobtype,
        salary,
        setSalary,
        filterfunc,
      }}
    >
      {children}
    </itemContext.Provider>
  );
}
