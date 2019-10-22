// @ts-check
// Module ui/about-respec
// A simple about dialog with pointer to the help
import { l10n, lang } from "../core/l10n.js";
import hyperHTML from "nanohtml";
import { ui } from "../core/ui.js";

// window.respecVersion is added at build time (see tools/builder.js)
window.respecVersion = window.respecVersion || "Developer Edition";
const div = document.createElement("div");
const button = ui.addCommand(
  `About ${window.respecVersion}`,
  show,
  "Ctrl+Shift+Alt+A",
  "ℹ️"
);

function show() {
  ui.freshModal(
    `${l10n[lang].about_respec} - ${window.respecVersion}`,
    div,
    button
  );
  const entries = [];
  if ("getEntriesByType" in performance) {
    performance
      .getEntriesByType("measure")
      .sort((a, b) => b.duration - a.duration)
      .map(({ name, duration }) => {
        const humanDuration =
          duration > 1000
            ? `${Math.round(duration / 1000.0)} second(s)`
            : `${duration.toFixed(2)} milliseconds`;
        return { name, duration: humanDuration };
      })
      .map(perfEntryToTR)
      .forEach(entry => {
        entries.push(entry);
      });
  }
  const fragment = hyperHTML`
  <p>
    ReSpec is a document production toolchain, with a notable focus on W3C specifications.
  </p>
  <p>
    <a href='https://github.com/w3c/respec/wiki'>Documentation</a>,
    <a href='https://github.com/w3c/respec/issues'>Bugs</a>.
  </p>
  <table border="1" width="100%" hidden="${entries.length ? false : true}">
    <caption>
      Loaded plugins
    </caption>
    <thead>
      <tr>
        <th>
          Plugin Name
        </th>
        <th>
          Processing time
        </th>
      </tr>
    </thead>
    <tbody>${entries}</tbody>
  </table>
`;
  div.textContent = "";
  div.append(fragment);
}

function perfEntryToTR({ name, duration }) {
  const moduleURL = `https://github.com/w3c/respec/tree/develop/src/${name}.js`;
  return hyperHTML`
    <tr>
      <td>
        <a href="${moduleURL}">
          ${name}
        </a>
      </td>
      <td>
        ${duration}
      </td>
    </tr>
  `;
}
