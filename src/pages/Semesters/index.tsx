import { FC, ReactElement } from "react"
import Layout from "./Layout";

const Semesters: FC = (): ReactElement => {
  document.title = "Dashboard - Semester";
  return (
    <Layout />
  )
}

export default Semesters
