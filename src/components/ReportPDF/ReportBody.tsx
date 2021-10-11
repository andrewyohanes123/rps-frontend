import { FC, ReactElement, useCallback } from "react"
import { View } from "@react-pdf/renderer"
import TableCell from "./TableCell"
import TableRow from "./TableRow"
import { ReportAttributes } from "types"
import moment from "moment"

interface props {
  reports: ReportAttributes[];
}

const ReportBody: FC<props> = ({ reports }): ReactElement => {

  const getSumToCurrentIndex = useCallback((index: number): number => {
    if (index > 0) {
      return reports.filter((val, idx) => idx <= index).map(row => (row.schedule.week_count)).reduce((a, b) => (a + b));
    } else {
      return 1;
    }
  }, [reports]);

  const getMultipleWeekCount = useCallback((value: number, count: number): number[] => {
    return Array(count).fill(0).map((element: number, index) => (element) + (index + ((count === 3 ? value - 1 : value) - 1)))
  }, []);

  return (
    <View style={{ flex: 1, fontSize: 10, flexDirection: 'column', marginTop: 5, fontFamily: 'Times' }}>
      <TableRow>
        <TableCell text="PERTEMUAN KE-" flex={1} />
        <TableCell style={{ marginLeft: -1, fontFamily: 'Times' }} text="TANGGAL" flex={2} />
        <TableCell style={{ marginLeft: -1 }} text="TOPIK/SUB TOPIK BAHASAN" flex={4} />
        <TableCell style={{ marginLeft: -1 }} text="PARAF DOSEN" flex={1} />
        <TableCell style={{ marginLeft: -1 }} text="PARAF KETUA KELAS" flex={1} />
        <TableCell style={{ marginLeft: -1 }} text="KET." flex={1} />
      </TableRow>
      {
        reports.map((report, index: number) => (
          report.schedule.week_count === 1 ?
            <TableRow key={`${report.id}`}>
              <TableCell text={`${getSumToCurrentIndex(index)}`} flex={1} />
              <TableCell style={{ marginLeft: -1 }} text={`${moment(report.created_at).format('DD-MM-YYYY')}`} flex={2} />
              <TableCell style={{ marginLeft: -1, fontSize: 11 }} text={
                `${getSumToCurrentIndex(index) === 8 ? 'Evaluasi Tengah Semester' : getSumToCurrentIndex(index) === 16 ? 'Evaluasi Akhir Semester' : report.schedule.study_material}`
              } flex={4} />
              <TableCell style={{ marginLeft: -1, fontFamily: 'Segoe' }} text={report.lecturer_id === null ? "-" : "✓"} flex={1} />
              <TableCell style={{ marginLeft: -1, fontFamily: 'Segoe' }} text={report.chairman_id === null ? "-" : "✓"} flex={1} />
              <TableCell style={{ marginLeft: -1 }} text="" flex={1} />
            </TableRow>
            :
            getMultipleWeekCount(getSumToCurrentIndex(index), report.schedule.week_count).map(week => (
              <TableRow key={`${report.id}`}>
                <TableCell text={`${week}`} flex={1} />
                <TableCell style={{ marginLeft: -1 }} text={`${moment(report.created_at).format('DD-MM-YYYY')}`} flex={2} />
                <TableCell style={{ marginLeft: -1, fontSize: 11 }} text={
                  `${getSumToCurrentIndex(index) === 8 ? 'Evaluasi Tengah Semester' : getSumToCurrentIndex(index) === 16 ? 'Evaluasi Akhir Semester' : report.schedule.study_material}`
                } flex={4} />
                <TableCell style={{ marginLeft: -1, fontFamily: 'Segoe' }} text={report.lecturer_id === null ? "-" : "✓"} flex={1} />
                <TableCell style={{ marginLeft: -1, fontFamily: 'Segoe' }} text={report.chairman_id === null ? "-" : "✓"} flex={1} />
                <TableCell style={{ marginLeft: -1 }} text="" flex={1} />
              </TableRow>
            ))
        ))
      }
    </View>
  )
}

export default ReportBody