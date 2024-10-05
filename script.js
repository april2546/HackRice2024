import React from "https://esm.sh/react@18.3.1";
import ReactDOM from "https://esm.sh/react-dom@18.3.1";
import { CSSTransition } from "https://esm.sh/react-transition-group";

async function generatePlan(jsonReq) {
  // Fetch post request.
  const something = await fetch('http://localhost:5000/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json' },

    body: JSON.stringify(jsonReq) }).
  then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  }).
  then(data => {return data;});

  return something;
}

function tabulate(jsonObj) {
  const plan = jsonObj["degree_plan"];
  //Order array
  let ordered = [];
  if ("Freshman" in plan) {
    let temp = [];
    temp.push(plan["Freshman"]["Fall Semester"]);
    temp.push(plan["Freshman"]["Spring Semester"]);
    ordered.push(temp);
  }

  if ("Sophomore" in plan) {
    let temp = [];
    temp.push(plan["Sophomore"]["Fall Semester"]);
    temp.push(plan["Sophomore"]["Spring Semester"]);
    ordered.push(temp);
  }

  if ("Junior" in plan) {
    let temp = [];
    temp.push(plan["Junior"]["Fall Semester"]);
    temp.push(plan["Junior"]["Spring Semester"]);
    ordered.push(temp);
  }

  if ("Senior" in plan) {
    let temp = [];
    temp.push(plan["Senior"]["Fall Semester"]);
    temp.push(plan["Senior"]["Spring Semester"]);
    ordered.push(temp);
  }

  ordered = ordered.map(yearArr => {
    let mapping = [];
    mapping[0] = [...yearArr[0]["Required_Courses"], ...yearArr[0]["Distribution_Courses"], ...yearArr[0]["Free_Electives"]];
    const total = mapping[0].reduce((accumulator, currentValue) => {
      return accumulator + parseInt(currentValue["credit_hours"]);
    }, 0);

    mapping[0].push({ "title": "Total Hours", "credit_hours": total.toString() });
    mapping[1] = [...yearArr[1]["Required_Courses"], ...yearArr[1]["Distribution_Courses"], ...yearArr[1]["Free_Electives"]];
    const total2 = mapping[1].reduce((accumulator, currentValue) => {
      return accumulator + parseInt(currentValue["credit_hours"]);
    }, 0);
    mapping[1].push({ "title": "Total Hours", "credit_hours": total2.toString() });
    return mapping;
  });
  const yearNames = ["Freshman", "Sophomore", "Junior", "Senior"].slice(4 - ordered.length, 4);
  console.log(yearNames);
  const reactArr = ordered.map((yearClasses, index) => {
    return /*#__PURE__*/(
      React.createElement("section", null, /*#__PURE__*/
      React.createElement("h1", null, yearNames[index]), /*#__PURE__*/
      React.createElement("div", { class: "side-by-side" }, /*#__PURE__*/
      React.createElement("div", null, /*#__PURE__*/
      React.createElement("div", { class: "tbl-header" }, /*#__PURE__*/
      React.createElement("table", { cellpadding: "0", cellspacing: "0", border: "0" }, /*#__PURE__*/
      React.createElement("thead", null, /*#__PURE__*/
      React.createElement("tr", null, /*#__PURE__*/
      React.createElement("th", null, "Fall Semester"))))), /*#__PURE__*/




      React.createElement("div", { class: "tbl-content" }, /*#__PURE__*/
      React.createElement("table", { cellpadding: "0", cellspacing: "0", border: "0" }, /*#__PURE__*/
      React.createElement("tbody", null,

      yearClasses[0].map(jsonObj => {
        return /*#__PURE__*/(
          React.createElement("tr", null, /*#__PURE__*/
          React.createElement("td", null, jsonObj["title"]), /*#__PURE__*/
          React.createElement("td", null, jsonObj["credit_hours"])));

      }))))), /*#__PURE__*/





      React.createElement("div", null, /*#__PURE__*/
      React.createElement("div", { class: "tbl-header" }, /*#__PURE__*/
      React.createElement("table", { cellpadding: "0", cellspacing: "0", border: "0" }, /*#__PURE__*/
      React.createElement("thead", null, /*#__PURE__*/
      React.createElement("tr", null, /*#__PURE__*/
      React.createElement("th", null, "Spring Semester"))))), /*#__PURE__*/




      React.createElement("div", { class: "tbl-content" }, /*#__PURE__*/
      React.createElement("table", { cellpadding: "0", cellspacing: "0", border: "0" }, /*#__PURE__*/
      React.createElement("tbody", null,

      yearClasses[1].map(jsonObj => {
        return /*#__PURE__*/(
          React.createElement("tr", null, /*#__PURE__*/
          React.createElement("td", null, jsonObj["title"]), /*#__PURE__*/
          React.createElement("td", null, jsonObj["credit_hours"])));

      }))))))));








  });

  return reactArr;
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIdx: 0,
      plan: [] };

    this.setPageIdx = this.setPageIdx.bind(this);
    this.setPlan = this.setPlan.bind(this);
  }

  setPageIdx(pageIdx) {
    this.setState(() => {return { pageIdx: pageIdx };});
  }

  setPlan(plan) {
    this.setState(() => {return { plan: plan };});
  }

  render() {
    return /*#__PURE__*/(
      React.createElement("div", { id: "main",
        class: "container-fluid" }, /*#__PURE__*/

      React.createElement(Navbar, { throwPageIdx: this.setPageIdx }), /*#__PURE__*/
      React.createElement(CSSTransition, {
        in: this.state.pageIdx === 0,
        timeout: 300,
        classNames: "generic",
        unmountOnExit: true }, /*#__PURE__*/

      React.createElement(Form, { throwPageIdx: this.setPageIdx, throwPlan: this.setPlan })), /*#__PURE__*/

      React.createElement(CSSTransition, {
        in: this.state.pageIdx === 1,
        timeout: 300,
        classNames: "generic",
        unmountOnExit: true }, /*#__PURE__*/

      React.createElement(Table, { semesterTables: this.state.plan }))));



  }}


class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.onTitleClick = this.onTitleClick.bind(this);
  }

  onTitleClick() {
    this.props.throwPageIdx(0);
  }


  render() {
    return /*#__PURE__*/(
      React.createElement("div", { id: "navbar",
        class: "container-fluid" }, /*#__PURE__*/

      React.createElement("h1", { onClick: this.onTitleClick }, "DegreeMap AI")));


  }}


class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courseText: "",
      echoText: "",
      major: "Computer Science",
      year: "Freshman",
      buttonsDisabled: false };

    this.onAddCourse = this.onAddCourse.bind(this);
    this.onCourseInput = this.onCourseInput.bind(this);
    this.onSelectMajor = this.onSelectMajor.bind(this);
    this.onSelectYear = this.onSelectYear.bind(this);
    this.onGeneratePlan = this.onGeneratePlan.bind(this);
  }

  onAddCourse(event) {
    event.preventDefault();
    this.setState(prevState => {
      return {
        echoText: prevState.echoText + prevState.courseText,
        courseText: "" };

    });
  }

  onCourseInput(event) {
    this.setState(() => {return { courseText: event.target.value + "\n" };});
  }

  onSelectMajor(event) {
    this.setState(() => {return { major: event.target.value };});
  }

  onSelectYear(event) {
    this.setState(() => {return { year: event.target.value };});
  }

  onGeneratePlan(event) {
    event.preventDefault();
    // console.log(this.state.echoText)
    this.setState(() => {{return { buttonsDisabled: true };}}, () => {
      const jsonReq = {
        major: this.state.major,
        year: this.state.year,
        courses: this.state.echoText.split(/\r?\n/) };


      generatePlan(jsonReq).then(obj => {
        this.props.throwPlan(tabulate(obj));
        this.props.throwPageIdx(1);
        this.setState(() => {return {
            courseText: "",
            echoText: "",
            major: "Computer Science",
            year: "Freshman",
            buttonsDisabled: false };
        });
      });
    });
  }

  render() {
    return /*#__PURE__*/(
      React.createElement("form", { onSubmit: this.onSignUp }, /*#__PURE__*/
      React.createElement("label", { for: "major" }, "Select your Major"), /*#__PURE__*/
      React.createElement("select", { class: "hover-expand-small", value: this.state.major, onChange: this.onSelectMajor, id: "major", name: "major" }, /*#__PURE__*/
      React.createElement("option", { value: "Computer Science" }, "Computer Science"), /*#__PURE__*/
      React.createElement("option", { value: "Business" }, "Business"), /*#__PURE__*/
      React.createElement("option", { value: "Philosophy" }, "Philosophy")), /*#__PURE__*/



      React.createElement("label", { for: "course-list" }, "Enter courses you have already taken (if any)"), /*#__PURE__*/
      React.createElement("div", { class: "side-by-side" }, /*#__PURE__*/
      React.createElement("div", { class: "top-bottom" }, /*#__PURE__*/
      React.createElement("input", { class: "hover-expand-small", type: "text", id: "course-list", name: "course", onChange: this.onCourseInput, value: this.state.courseText }), /*#__PURE__*/
      React.createElement("button", { class: "button-63 hover-expand-big", onClick: this.onAddCourse, disabled: this.state.buttonsDisabled }, "Add course")), /*#__PURE__*/

      React.createElement("textarea", { id: "course-echo", value: this.state.echoText })), /*#__PURE__*/


      React.createElement("label", { for: "college-year" }, "Which year are you going into?"), /*#__PURE__*/
      React.createElement("div", { class: "top-bottom" }, /*#__PURE__*/
      React.createElement("select", { class: "hover-expand-small", value: this.state.year, onChange: this.onSelectYear, id: "college-year", name: "year" }, /*#__PURE__*/
      React.createElement("option", { value: "Freshman" }, "Freshman"), /*#__PURE__*/
      React.createElement("option", { value: "Sophomore" }, "Sophomore"), /*#__PURE__*/
      React.createElement("option", { value: "Junior" }, "Junior"), /*#__PURE__*/
      React.createElement("option", { value: "Senior" }, "Senior")),


      this.state.buttonsDisabled ? /*#__PURE__*/React.createElement(LoadingIcon, null) : /*#__PURE__*/React.createElement("button", { class: "button-63 hover-expand-big", onClick: this.onGeneratePlan }, "Generate Plan"))));



  }}


class LoadingIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return /*#__PURE__*/React.createElement("div", { class: "lds-ellipsis" }, /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null));
  }}


class Table extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return /*#__PURE__*/(
      React.createElement("div", { id: "four-year-plan" },
      this.props.semesterTables));


  }}


ReactDOM.render( /*#__PURE__*/React.createElement(Main, null), document.querySelector("body"));