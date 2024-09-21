import React from "https://esm.sh/react@18.3.1";
import ReactDOM from "https://esm.sh/react-dom@18.3.1";
import { CSSTransition } from "https://esm.sh/react-transition-group";

async function generatePlan(jsonReq) {
  // Fetch post request.
  const something = await fetch('http://localhost:3000/something', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json' },

    body: JSON.stringify(jsonReq) }).
  then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  }).
  then(data => {console.log("Fetched Data", data);return data;});

  return something;
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIdx: 0 };

    this.setPageIdx = this.setPageIdx.bind(this);
  }

  setPageIdx(pageIdx) {
    this.setState(() => {return { pageIdx: pageIdx };});
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

      React.createElement(Form, { throwPageIdx: this.setPageIdx })), /*#__PURE__*/

      React.createElement(CSSTransition, {
        in: this.state.pageIdx === 1,
        timeout: 300,
        classNames: "generic",
        unmountOnExit: true }, /*#__PURE__*/

      React.createElement(Table, null))));



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
    this.setState(() => {{return { buttonsDisabled: true };}}, () => {
      const jsonReq = {
        major: this.state.major,
        year: this.state.year,
        courses: this.state.courses.split(/\r?\n/) };

      generatePlan(jsonReq).then(() => {
        this.props.throwPageIdx(1);
        this.setState(() => {return { buttonsDisabled: false };});
      });
    });
  }

  render() {
    return /*#__PURE__*/(
      React.createElement("form", { onSubmit: this.onSignUp }, /*#__PURE__*/
      React.createElement("label", { for: "major" }, "Select your Major"), /*#__PURE__*/
      React.createElement("select", { class: "hover-expand-small", value: this.state.major, onChange: this.onSelectMajor, id: "major", name: "major" }, /*#__PURE__*/
      React.createElement("option", { value: "Computer Science" }, "Computer Science"), /*#__PURE__*/
      React.createElement("option", { value: "Electrical Engineering" }, "Electrical Engineering"), /*#__PURE__*/
      React.createElement("option", { value: "Mechanical Engineering" }, "Mechanical Engineering"), /*#__PURE__*/
      React.createElement("option", { value: "Physics" }, "Physics")), /*#__PURE__*/



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
    let semesters = ["Freshman Year", "Sophomore Year", "Junior Year", "Senior Year"];
    let semesterTable = semesters.map(label => {
      return /*#__PURE__*/(
        React.createElement("section", null, /*#__PURE__*/
        React.createElement("h1", null, label), /*#__PURE__*/
        React.createElement("div", { class: "side-by-side" }, /*#__PURE__*/
        React.createElement("div", null, /*#__PURE__*/
        React.createElement("div", { class: "tbl-header" }, /*#__PURE__*/
        React.createElement("table", { cellpadding: "0", cellspacing: "0", border: "0" }, /*#__PURE__*/
        React.createElement("thead", null, /*#__PURE__*/
        React.createElement("tr", null, /*#__PURE__*/
        React.createElement("th", null, "Fall Semester"))))), /*#__PURE__*/




        React.createElement("div", { class: "tbl-content" }, /*#__PURE__*/
        React.createElement("table", { cellpadding: "0", cellspacing: "0", border: "0" }, /*#__PURE__*/
        React.createElement("tbody", null)))), /*#__PURE__*/





        React.createElement("div", null, /*#__PURE__*/
        React.createElement("div", { class: "tbl-header" }, /*#__PURE__*/
        React.createElement("table", { cellpadding: "0", cellspacing: "0", border: "0" }, /*#__PURE__*/
        React.createElement("thead", null, /*#__PURE__*/
        React.createElement("tr", null, /*#__PURE__*/
        React.createElement("th", null, "Spring Semester"))))), /*#__PURE__*/




        React.createElement("div", { class: "tbl-content" }, /*#__PURE__*/
        React.createElement("table", { cellpadding: "0", cellspacing: "0", border: "0" }, /*#__PURE__*/
        React.createElement("tbody", null)))))));








    });
    return /*#__PURE__*/(
      React.createElement("div", { id: "four-year-plan" },
      semesterTable));


  }}


ReactDOM.render( /*#__PURE__*/React.createElement(Main, null), document.querySelector("body"));