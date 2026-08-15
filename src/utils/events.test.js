// node src/utils/events.test.js
import assert from "node:assert";
import { academicYearOf, academicYears, eventsInYear } from "./events.js";

assert.equal(academicYearOf("2024-06-01"), "2024-2025"); // June starts the year
assert.equal(academicYearOf("2025-05-31"), "2024-2025"); // May ends it
assert.equal(academicYearOf(undefined), null);

const events = [
  { id: "a", eventDate: "2024-01-27" },
  { id: "b", eventDate: "2024-09-10" },
  { id: "c", eventDate: "2024-11-02" },
  { id: "d", eventDate: "not a date" },
];

assert.deepEqual(academicYears(events), ["2024-2025", "2023-2024"]);
assert.deepEqual(eventsInYear(events, "2024-2025").map((e) => e.id), ["c", "b"]);
assert.deepEqual(eventsInYear(events, "2023-2024").map((e) => e.id), ["a"]);

console.log("ok");
