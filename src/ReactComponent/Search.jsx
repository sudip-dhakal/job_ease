import React from "react";

export default function Search() {
  return (
    <>
      <div class="brands_form">
        <form
          class="prolancer-select-search"
          method="GET"
          action="https://themebing.com/wp/prolancer/"
        >
          <input type="text" name="s" placeholder="Search for..." />
          <select name="post_type" class="form-select">
            <option value="services" selected="">
              Services
            </option>
            <option value="projects">Projects</option>
            <option value="sellers">Talent</option>
          </select>
          <input type="submit" value="Search" />
        </form>
      </div>
    </>
  );
}
