import { FC, ReactElement, useCallback, useEffect, useState } from "react"
import { ScheduleAttributes, StudentAttributes } from "types"

interface props {
  students: StudentAttributes[];
  schedule: ScheduleAttributes;
}

const StudentQuestioners: FC<props> = ({ schedule, students }): ReactElement => {
  const [studentResponses, setStudentResponses] = useState<StudentAttributes[]>([]);

  const getStudents = useCallback(() => {

  }, []);

  return (
    <div>

    </div>
  )
}

export default StudentQuestioners
