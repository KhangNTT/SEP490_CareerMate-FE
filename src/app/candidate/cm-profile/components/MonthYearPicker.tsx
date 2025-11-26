interface MonthYearPickerProps {
    monthValue: string;
    yearValue: string;
    onMonthChange: (value: string) => void;
    onYearChange: (value: string) => void;
    label?: string;
    required?: boolean;
}

export default function MonthYearPicker({
    monthValue,
    yearValue,
    onMonthChange,
    onYearChange,
    label,
    required = false
}: MonthYearPickerProps) {
    const months = [
        { value: "01", label: "01" },
        { value: "02", label: "02" },
        { value: "03", label: "03" },
        { value: "04", label: "04" },
        { value: "05", label: "05" },
        { value: "06", label: "06" },
        { value: "07", label: "07" },
        { value: "08", label: "08" },
        { value: "09", label: "09" },
        { value: "10", label: "10" },
        { value: "11", label: "11" },
        { value: "12", label: "12" },
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="grid grid-cols-2 gap-2">
                <select
                    value={monthValue}
                    onChange={(e) => onMonthChange(e.target.value)}
                    className="h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    <option value="">Month</option>
                    {months.map((month) => (
                        <option key={month.value} value={month.value}>
                            {month.label}
                        </option>
                    ))}
                </select>
                <select
                    value={yearValue}
                    onChange={(e) => onYearChange(e.target.value)}
                    className="h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    <option value="">Year</option>
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
