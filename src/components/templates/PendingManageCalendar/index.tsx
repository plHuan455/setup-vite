import { useMemo, useState } from "react";
import useMatchMedia from "../../../hooks/useMatchMedia";
import { addZero, convertMoney, isADate, numberToMoney } from "../../../utils/funcs";
import Text from "../../atoms/Text";
import Calendar, { CalendarProps, NoteType } from "../../organisms/Calendar";
import Container from "../../organisms/Container";
import Modal from "../../organisms/Modal";

export interface PendingManageNote {
  money: number;
  content: string;
  bank: string;
  date: Date;
}
interface PendingManageCalendarProps extends Omit<CalendarProps, 'noteList'> {
  noteList?: PendingManageNote[];
}

const PendingManageCalendar: React.FC<PendingManageCalendarProps> = ({
  noteList = [],
  selectedDate = new Date(),
  onChange,
  ...args
}) => {
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const { isMobile, isTablet } = useMatchMedia();
  const isDesktop = !(isMobile || isTablet);

  const convertNoteList = useMemo<NoteType[]>(() => {
    let moneyTotalHash: { [key: number]: { increaseMoney: number, decreaseMoney: number } } = {};

    noteList.forEach(note => {
      const noteDate = new Date((new Date(note.date)).setHours(0, 0, 0, 0));
      if (moneyTotalHash[noteDate.getTime()]) {
        if (note.money < 0)
          moneyTotalHash[noteDate.getTime()].decreaseMoney = moneyTotalHash[noteDate.getTime()].decreaseMoney + note.money;
        else {
          moneyTotalHash[noteDate.getTime()].increaseMoney = moneyTotalHash[noteDate.getTime()].increaseMoney + note.money;
        }
        return;
      }

      moneyTotalHash[noteDate.getTime()] = {
        increaseMoney: note.money >= 0 ? note.money : 0,
        decreaseMoney: note.money < 0 ? note.money : 0,
      }
    }, [noteList]);

    return Object.keys(moneyTotalHash).map(keyValue => {
      const increaseMoney = moneyTotalHash[Number(keyValue)].increaseMoney;
      const decreaseMoney = Math.abs(moneyTotalHash[Number(keyValue)].decreaseMoney);

      return {
        date: new Date(Number(keyValue)),
        noteNode: <div className="t-pendingManageCalendar_note">
          <Text modifiers={['14x16', '600', 'deepGreenCyanTurquoise']}>
            {`+${isDesktop ? numberToMoney(increaseMoney) : convertMoney(increaseMoney)}`}
          </Text>
          <Text modifiers={['14x16', '600', 'rustyRed']}>
            {`-${isDesktop ? numberToMoney(decreaseMoney) : convertMoney(decreaseMoney)}`}
          </Text>
        </div>
      }
    })
  }, [noteList, isDesktop]);

  const noteInSelectedDateList = useMemo(() => {
    if (isShowModal) {
      return noteList.filter(note => isADate(note.date, selectedDate));
    }

    return [];
  }, [selectedDate, isShowModal]);

  return <div className="t-pendingManageCalendar">
    <Container>
      <Calendar
        {...args}
        selectedDate={selectedDate}
        onChange={(date) => {
          if (onChange) onChange(date);
          setIsShowModal(true);
        }}
        noteList={convertNoteList}
      />
    </Container>
    <Modal
      isOpen={isShowModal}
      handleClose={() => setIsShowModal(false)}
      modifiers='calendar'
    >
      <div className="t-pendingManageCalendar_modal">
        {/* {noteInSelectedDateList.map(value => <Text modifiers={['black']}>{`content: ${value.content}, money: ${value.money}`}</Text>)} */}
        <div className="t-pendingManageCalendar_modal_title">
          <Text type="h2" modifiers={['black', '24x28', '600', 'center']}>
            Danh sách chi tiêu 
          </Text>
          <Text type="h2" modifiers={['lightSlateGray', '20x24', '600', 'center']}>
            {`(${addZero(selectedDate.getDate())}/${addZero(selectedDate.getMonth())}/${selectedDate.getFullYear()})`}
          </Text>
        </div>

        <table className="t-pendingManageCalendar_modal_table">
          <thead>
            <tr>
              <th className="col-1">Stt</th>
              <th className="col-5">Nội dung</th>
              <th className="col-2">Số tiền</th>
              <th className="col-3">Ngân hàng</th>
              <th className="col-1">Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {noteInSelectedDateList.length === 0 && (
              <tr>
                <td className="col-12" colSpan={4}>
                  <Text modifiers={['14x21', '500', 'charlestonGreen', 'center', 'fontLexend']}>Không có dữ liệu</Text>
                </td>
              </tr>
            )}
            {noteInSelectedDateList.map((value, idx) => <tr>
              <td className="col-1"><Text modifiers={['14x21', '600', 'charlestonGreen', 'fontLexend']}>{idx + 1}</Text></td>
              <td className="col-5"><Text modifiers={['14x21', '600', 'charlestonGreen', 'fontLexend']}>{value.content}</Text></td>
              <td className="col-2">
                <Text
                  modifiers={['14x21', '600', value.money < 0 ? 'rustyRed' : 'deepGreenCyanTurquoise', 'fontLexend']}
                >
                  {value.money > 0 ? `+${numberToMoney(value.money)}` : numberToMoney(value.money)}
                </Text>
              </td>
              <td className="col-3"><Text modifiers={['14x21', '500', 'charlestonGreen', 'fontLexend']}>{value.bank}</Text></td>
              <td className="col-1"><Text modifiers={['14x21', '500', 'charlestonGreen', 'fontLexend']}>{`${addZero(value.date.getHours())}:${addZero(value.date.getMinutes())}`}</Text></td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </Modal>
  </div>
}

export default PendingManageCalendar;
