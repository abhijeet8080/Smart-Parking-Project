import React,{useState} from "react";
import { Link, useNavigate } from 'react-router-dom'
import "./Search.css"
const Search = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("")
    const searchSubmitHandler = (e)=>{
        e.preventDefault();
        if(keyword.trim()){
            navigate(`/parkings/${keyword}`)
        }else{
            navigate("/parkings")
        }
    }
  return (
    <>
      <form action="" className="searchBox" onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="Search a Parking"
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input type="submit" value="Search" />
      </form>
    </>
  );
};

export default Search;
