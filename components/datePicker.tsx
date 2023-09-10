import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type DateRangeSelectorProps = {
  onSelectDateRange: (startDate: Date, endDate: Date) => void;
};

function DateRangeSelector({ onSelectDateRange }: DateRangeSelectorProps) {
  const [selectedOption, setSelectedOption] = useState<string>("week");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleDateRangeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedOption(event.target.value);
  };

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  useEffect(() => {
    const today = new Date();
    switch (selectedOption) {
      case "week":
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);
        setStartDate(oneWeekAgo);
        setEndDate(today);
        break;
      case "month":
        const oneMonthAgo = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          today.getDate()
        );
        setStartDate(oneMonthAgo);
        setEndDate(today);
        break;
      case "year":
        const oneYearAgo = new Date(
          today.getFullYear() - 1,
          today.getMonth(),
          today.getDate()
        );
        setStartDate(oneYearAgo);
        setEndDate(today);
        break;
      default:
        break;
    }
  }, [selectedOption]);

  useEffect(() => {
    // Call onSelectDateRange when startDate or endDate changes
    if (startDate !== null && endDate !== null) {
      onSelectDateRange(startDate, endDate);
    }
  }, [startDate, endDate, onSelectDateRange]);

  const handleApplyClick = () => {
    // onSelectDateRange is now called in the useEffect when startDate or endDate changes
  };

  return (
    <div className="datePicker">
      <select
        className="preSet"
        value={selectedOption}
        onChange={handleDateRangeChange}
      >
        <option value="week">1 Week</option>
        <option value="month">1 Month</option>
        <option value="year">1 Year</option>
        <option value="custom">Custom</option>
      </select>

      {selectedOption === "custom" && (
        <div className="dataPickerCus">
          <DatePicker
            selected={startDate}
            onChange={handleStartDateChange}
            placeholderText="Start Date"
          />
          <DatePicker
            selected={endDate}
            onChange={handleEndDateChange}
            placeholderText="End Date"
          />
          <button onClick={handleApplyClick}>Apply</button>
        </div>
      )}
    </div>
  );
}

export default DateRangeSelector;
