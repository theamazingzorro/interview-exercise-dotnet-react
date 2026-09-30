import type { CourseSummary } from "./types";

interface CourseTableProps {
  courses: CourseSummary[];
  onSync: (id: number) => void | Promise<void>;
  syncingIds: number[];
  syncErrors: Record<number, string>;
}

// Presentational component: renders the list of courses in a table.
//
// The read-only columns are done. Two things are left for you to build:
//   1. Visibly highlight courses whose syllabus is out of date (see
//      `course.isOutOfDate`) so an instructor can spot them at a glance.
//   2. Add a "Sync Now" button per row that calls `onSync(course.id)`, with
//      an accessible in-progress / disabled state while the request runs.
export default function CourseTable({ courses, onSync, syncingIds, syncErrors }: CourseTableProps) {
  if (courses.length === 0) {
    return <p className="empty">No courses to show.</p>;
  }

  return (
    <table className="course-table">
      <thead>
        <tr>
          <th>Code</th>
          <th>Title</th>
          <th>Department</th>
          <th>Term</th>
          <th>Syllabus Status</th>
          <th>Last Synced</th>
          <th>Sync</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course) => (
          <tr 
            key={course.id}
            className={course.isOutOfDate ? "course-row-out-of-date" : undefined} 
          >
            <td>{course.code}</td>
            <td>{course.title}</td>
            <td>{course.department}</td>
            <td>{course.term}</td>
            <td>
              {course.syllabusStatus}
              {course.isOutOfDate && (
                <span className="out-of-date-label">Needs attention</span>
              )}
            </td>
            <td>{formatLastSynced(course.lastSyncedUtc)}</td>
            <td className="sync-action">
              <button
                type="button"
                disabled={syncingIds.includes(course.id)}
                aria-busy={syncingIds.includes(course.id)}
                onClick={() => void onSync(course.id)}
              >
                {syncingIds.includes(course.id) ? "Syncing…" : "Sync Now"}
              </button>
              {syncErrors[course.id] && (
                <p className="sync-error" role="alert">
                  {syncErrors[course.id]}
                </p>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function formatLastSynced(lastSyncedUtc: string | null): string {
  if (!lastSyncedUtc) {
    return "Never";
  }
  return new Date(lastSyncedUtc).toLocaleString();
}
