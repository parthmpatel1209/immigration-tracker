"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./DateCalendar.module.css";

interface DateCalendarProps {
    onDateSelect: (date: Date) => void;
    onClose: () => void;
    position: { x: number; y: number };
    minDate?: Date;
    maxDate?: Date;
}

export function DateCalendar({ onDateSelect, onClose, position, minDate, maxDate }: DateCalendarProps) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const calendarRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        // Close on ESC key
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, [onClose]);

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const daysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const firstDayOfMonth = (month: number, year: number) => {
        return new Date(year, month, 1).getDay();
    };

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handleDateClick = (day: number) => {
        const selectedDate = new Date(currentYear, currentMonth, day);
        selectedDate.setHours(0, 0, 0, 0);

        // Check if date is in valid range
        if (maxDate && selectedDate > maxDate) return;
        if (minDate && selectedDate < minDate) return;

        onDateSelect(selectedDate);
        onClose();
    };

    const isDateDisabled = (day: number): boolean => {
        const date = new Date(currentYear, currentMonth, day);
        date.setHours(0, 0, 0, 0);

        if (maxDate && date > maxDate) return true;
        if (minDate && date < minDate) return true;

        return false;
    };

    const isToday = (day: number): boolean => {
        return (
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
        );
    };

    const renderCalendarDays = () => {
        const days = [];
        const totalDays = daysInMonth(currentMonth, currentYear);
        const firstDay = firstDayOfMonth(currentMonth, currentYear);

        // Empty cells for days before the first day of month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
        }

        // Actual days
        for (let day = 1; day <= totalDays; day++) {
            const disabled = isDateDisabled(day);
            const todayClass = isToday(day) ? styles.today : "";
            const disabledClass = disabled ? styles.disabled : "";

            days.push(
                <button
                    key={day}
                    className={`${styles.day} ${todayClass} ${disabledClass}`}
                    onClick={() => !disabled && handleDateClick(day)}
                    disabled={disabled}
                >
                    {day}
                </button>
            );
        }

        return days;
    };

    // Adjust position to keep calendar on screen
    const adjustedPosition = {
        left: Math.min(position.x, window.innerWidth - 350),
        top: Math.min(position.y, window.innerHeight - 400)
    };

    return (
        <div
            ref={calendarRef}
            className={styles.calendar}
            style={{
                left: `${adjustedPosition.left}px`,
                top: `${adjustedPosition.top}px`
            }}
        >
            {/* Header */}
            <div className={styles.header}>
                <button
                    className={styles.navButton}
                    onClick={handlePrevMonth}
                    aria-label="Previous month"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className={styles.monthYear}>
                    {monthNames[currentMonth]} {currentYear}
                </div>

                <button
                    className={styles.navButton}
                    onClick={handleNextMonth}
                    aria-label="Next month"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Weekday labels */}
            <div className={styles.weekdays}>
                <div>Su</div>
                <div>Mo</div>
                <div>Tu</div>
                <div>We</div>
                <div>Th</div>
                <div>Fr</div>
                <div>Sa</div>
            </div>

            {/* Calendar grid */}
            <div className={styles.daysGrid}>
                {renderCalendarDays()}
            </div>

            {/* Footer with quick actions */}
            <div className={styles.footer}>
                <button
                    className={styles.todayButton}
                    onClick={() => {
                        setCurrentMonth(today.getMonth());
                        setCurrentYear(today.getFullYear());
                        handleDateClick(today.getDate());
                    }}
                >
                    Today
                </button>
            </div>
        </div>
    );
}
