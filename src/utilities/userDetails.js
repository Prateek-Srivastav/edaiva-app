// import { useContext } from "react";

// import candidateApi from "../src/api/candidate";
import campusCandidateApi from "../api/campusApis/candidate";
import candidateApi from "../api/candidate";
// import { UserContext } from "../auth/context";
import { useEffect, useState } from "react";
import useApi from "../hooks/useApi";

function userDetails() {
  const [isCampusStudent, setIsCampusStudent] = useState();
  const [isProfileComplete, setIsProfileComplete] = useState("falssss");
  // const userContext = useContext(UserContext)

  // const { data: campusProfileData, request: loadCampusProfile } = useApi(
  //   campusCandidateApi.getProfile
  // );

  // const { data: profileData, request: loadProfile } = useApi(
  //   candidateApi.getProfile
  // );

  // useEffect(() => {
  //   loadCampusProfile();
  //   loadProfile();
  // }, []);

  // if (profileData?.error !== "Candidate Profile not found!!") {
  //   setIsProfileComplete(false);
  // } else setIsProfileComplete(true);

  // if (campusProfileData?.detail !== "Your are not a part of any institution !")
  //   setIsCampusStudent(false);
  // else setIsCampusStudent(true);

  console.log(isProfileComplete, isCampusStudent);

  return isProfileComplete;
}

export default userDetails;
