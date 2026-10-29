"use client";

import { useState } from "react";
import Image from "next/image";

import workHistoryIcon from "@/assets/Apply/icons/work-history-22.svg";
import { ApplyField, ApplySelect, ApplyTextInput, messageIdFor } from "@/components/Apply/ApplyFormControls";
import ChoiceField from "@/components/ExperienceEducation/ChoiceField";
import { months, workYears, yesNo } from "@/components/ExperienceEducation/experienceOptions";

const emptyRole = {
    jobTitle: "",
    organization: "",
    location: "",
    current: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
};

const REQUIRED = {
    jobTitle: "Enter your job title.",
    organization: "Enter the organization.",
    location: "Enter the location.",
    current: "Select an option.",
    startMonth: "Select the start month.",
    startYear: "Select the start year.",
    endMonth: "Select the end month.",
    endYear: "Select the end year.",
};

// Month index from the year and month, to compare dates.
const monthIndex = (year, month) => Number(year) * 12 + months.indexOf(month);

function validateRole(role) {
    const errors = {};
    const fields = Object.keys(REQUIRED).filter((field) => role.current !== "Yes" || !field.startsWith("end"));
    for (const field of fields) {
        if (!String(role[field] ?? "").trim()) errors[field] = REQUIRED[field];
    }
    const now = new Date();
    const thisMonth = now.getFullYear() * 12 + now.getMonth();
    if (!errors.startMonth && !errors.startYear && monthIndex(role.startYear, role.startMonth) > thisMonth) {
        errors.startMonth = "The start can't be in the future.";
    }
    if (
        role.current !== "Yes" &&
        !errors.endMonth &&
        !errors.endYear &&
        !errors.startMonth &&
        monthIndex(role.endYear, role.endMonth) < monthIndex(role.startYear, role.startMonth)
    ) {
        errors.endMonth = "The end must be after the start.";
    }
    return errors;
}

// "March 2025 - October 2026", or "- Present" for the current role.
export const roleDates = (role) =>
    `${role.startMonth} ${role.startYear} - ${role.current === "Yes" ? "Present" : `${role.endMonth} ${role.endYear}`}`;

// Figma 1878:20439: one saved role on a grey bar, with Edit / Delete.
function RoleRow({ role, onEdit, onDelete }) {
    return (
        <li className="grid items-center gap-x-6 gap-y-2 rounded-xl bg-[#f8f9fa] p-6 text-sm leading-[1.4] text-ink-secondary md:grid-cols-[1.4fr_1fr_1fr_1.2fr_auto] motion-safe:animate-[apply-check-in_200ms_ease-out_both]">
            <span className="flex min-w-0 items-center gap-2">
                <span aria-hidden="true" className="h-[22px] w-[3px] shrink-0 rounded-[2px] bg-[#d9d9d9]" />
                <Image src={workHistoryIcon} alt="" width={19.56} height={20.78} className="shrink-0" />
                <span className="truncate text-lg leading-[1.2] font-medium text-ink">{role.jobTitle}</span>
            </span>
            <span className="truncate">{role.organization}</span>
            <span className="truncate">{role.location}</span>
            <span>{roleDates(role)}</span>
            <span className="flex items-center gap-2">
                <button type="button" onClick={onEdit} className="cursor-pointer px-3 py-2 text-muted-ink underline hover:text-ink">
                    Edit
                </button>
                <button type="button" onClick={onDelete} className="cursor-pointer px-3 py-2 text-[#b43838] underline hover:text-required">
                    Delete
                </button>
            </span>
        </li>
    );
}

// Figma 1878:20729: the role form on a grey panel. End month/year hide while
// Current Employment is Yes.
function RoleEditor({ initial, onSave, onCancel }) {
    const [role, setRole] = useState(initial);
    const [errors, setErrors] = useState({});

    const set = (field, value) => {
        setRole((current) => ({ ...current, [field]: value }));
        if (errors[field]) setErrors(({ [field]: _, ...rest }) => rest);
    };
    const control = (field) => ({
        id: `role-${field}`,
        name: field,
        value: role[field],
        invalid: Boolean(errors[field]),
        describedBy: messageIdFor(`role-${field}`, { error: errors[field] }),
    });
    const text = (field, label, placeholder) => (
        <ApplyField id={`role-${field}`} label={label} required error={errors[field]}>
            <ApplyTextInput {...control(field)} onChange={(event) => set(field, event.target.value)} placeholder={placeholder} />
        </ApplyField>
    );
    const select = (field, label, options, placeholder) => (
        <ApplyField id={`role-${field}`} label={label} required error={errors[field]}>
            <ApplySelect
                {...control(field)}
                onChange={(event) => set(field, event.target.value)}
                options={options}
                placeholder={placeholder}
            />
        </ApplyField>
    );

    const save = () => {
        const found = validateRole(role);
        setErrors(found);
        const first = Object.keys(found)[0];
        if (first) {
            document.getElementById(`role-${first}`)?.focus();
            return;
        }
        onSave(role.current === "Yes" ? { ...role, endMonth: "", endYear: "" } : role);
    };

    return (
        <div className="flex flex-col gap-6 rounded-xl bg-[#f8f9fa] p-6 motion-safe:animate-[apply-check-in_200ms_ease-out_both]">
            <div className="grid gap-x-8 gap-y-2 lg:grid-cols-3">
                {text("jobTitle", "Job Title", "Ex: Product Designer")}
                {text("organization", "Organization", "Ex: Support Studio Technologies")}
                {text("location", "Location", "Ex: Puducherry, India")}
            </div>
            <div className="grid gap-x-8 gap-y-4 lg:grid-cols-3">
                <ChoiceField
                    field="role-current"
                    label="Current Employment"
                    options={yesNo}
                    value={role.current}
                    error={errors.current}
                    onChange={(value) => set("current", value)}
                />
                <div className="grid grid-cols-2 gap-x-8">
                    {select("startMonth", "Start Month", months, "Month")}
                    {select("startYear", "Start Year", workYears, "Year")}
                </div>
                {role.current !== "Yes" && (
                    <div className="grid grid-cols-2 gap-x-8">
                        {select("endMonth", "End Month", months, "Month")}
                        {select("endYear", "End Year", workYears, "Year")}
                    </div>
                )}
            </div>
            <div className="flex items-center justify-end gap-4">
                {onCancel && (
                    <button type="button" onClick={onCancel} className="cursor-pointer px-3 py-3 text-xs leading-[1.4] text-ink-secondary hover:text-ink">
                        Cancel
                    </button>
                )}
                <button
                    type="button"
                    onClick={save}
                    className="cursor-pointer rounded-lg bg-action px-6 py-3 text-xs leading-[1.4] text-white transition-colors hover:bg-[#005192]"
                >
                    {initial === emptyRole ? "Add Experience" : "Save Experience"}
                </button>
            </div>
        </div>
    );
}

// Figma 1878:20438 / 1878:20729: the candidate's roles. With none saved the
// role form is open; saved roles list as rows with Edit / Delete, and "Add
// Another Role" opens the form again. `value` is the list of roles.
export default function WorkHistory({ value, error, onChange }) {
    // null (form closed), "new", or the index of the role being edited.
    const [editing, setEditing] = useState(null);
    const roles = value ?? [];
    const formOpen = roles.length === 0 || editing !== null;

    const save = (role) => {
        onChange(editing === null || editing === "new" ? [...roles, role] : roles.map((item, i) => (i === editing ? role : item)));
        setEditing(null);
    };

    return (
        <div className="flex flex-col gap-8">
            {roles.length > 0 && (
                <ul aria-label="Work experience" className="flex flex-col gap-4">
                    {roles.map((role, index) =>
                        editing === index ? null : (
                            <RoleRow
                                key={`${role.jobTitle}-${role.organization}-${index}`}
                                role={role}
                                onEdit={() => setEditing(index)}
                                onDelete={() => {
                                    onChange(roles.filter((_, i) => i !== index));
                                    setEditing(null);
                                }}
                            />
                        ),
                    )}
                </ul>
            )}

            {formOpen ? (
                <RoleEditor
                    key={editing ?? "first"}
                    initial={typeof editing === "number" ? roles[editing] : emptyRole}
                    onSave={save}
                    onCancel={roles.length > 0 ? () => setEditing(null) : null}
                />
            ) : (
                <button
                    type="button"
                    onClick={() => setEditing("new")}
                    className="cursor-pointer self-end rounded-lg bg-action px-6 py-3 text-xs leading-[1.4] text-white transition-colors hover:bg-[#005192]"
                >
                    Add Another Role
                </button>
            )}

            {error && (
                <p id="workHistory-message" role="alert" className="text-xs leading-[1.4] text-required">
                    {error}
                </p>
            )}
        </div>
    );
}
