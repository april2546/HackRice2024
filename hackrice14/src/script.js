import React from "https://esm.sh/react@18.3.1";
import ReactDOM from "https://esm.sh/react-dom@18.3.1";
import { CSSTransition } from "https://esm.sh/react-transition-group";

async function generatePlan(jsonReq) {
  // Fetch post request.
  const something = await fetch('http://localhost:5000/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jsonReq)
  }).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {return data;})
    
  return something;
}

function tabulate(jsonObj) {
  const plan = jsonObj["degree_plan"]
  //Order array
  let ordered = []
  if ("Freshman" in plan) {
    let temp = []
    temp.push(plan["Freshman"]["Fall Semester"])
    temp.push(plan["Freshman"]["Spring Semester"])
    ordered.push(temp)
  }
  
  if ("Sophomore" in plan) {
    let temp = []
    temp.push(plan["Sophomore"]["Fall Semester"])
    temp.push(plan["Sophomore"]["Spring Semester"])
    ordered.push(temp)
  }
  
  if ("Junior" in plan) {
    let temp = []
    temp.push(plan["Junior"]["Fall Semester"])
    temp.push(plan["Junior"]["Spring Semester"])
    ordered.push(temp)
  }
  
  if ("Senior" in plan) {
    let temp = []
    temp.push(plan["Senior"]["Fall Semester"])
    temp.push(plan["Senior"]["Spring Semester"])
    ordered.push(temp)
  }
  
  ordered = ordered.map(yearArr => {
    let mapping = []
    mapping[0] = [...yearArr[0]["Required_Courses"],...yearArr[0]["Distribution_Courses"], ...yearArr[0]["Free_Electives"]]
    const total = mapping[0].reduce((accumulator, currentValue) => {
  return accumulator + parseInt(currentValue["credit_hours"]);
  }, 0);
    
    mapping[0].push({ "title": "Total Hours", "credit_hours": total.toString()})
    mapping[1] = [...yearArr[1]["Required_Courses"],...yearArr[1]["Distribution_Courses"], ...yearArr[1]["Free_Electives"]]
    const total2 = mapping[1].reduce((accumulator, currentValue) => {
  return accumulator + parseInt(currentValue["credit_hours"]);
  }, 0);
    mapping[1].push({ "title": "Total Hours", "credit_hours": total2.toString()})
    return mapping
  })
  const yearNames = ["Freshman", "Sophomore", "Junior", "Senior"].slice(4 - ordered.length, 4)
  console.log(yearNames)
  const reactArr = ordered.map((yearClasses, index) => {
    return (
       <section>
        <h1>{yearNames[index]}</h1>
          <div class="side-by-side">
            <div>
              <div class="tbl-header">
          <table cellpadding="0" cellspacing="0" border="0">
            <thead>
              <tr>
                <th>Fall Semester</th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="tbl-content">
          <table cellpadding="0" cellspacing="0" border="0">
            <tbody>
             {
                yearClasses[0].map((jsonObj) => {
                  return (
                    <tr>
                      <td>{jsonObj["title"]}</td>
                      <td>{jsonObj["credit_hours"]}</td>
                    </tr>
                  )})
             }
            </tbody>
          </table>
        </div>
            </div>
           <div>
              <div class="tbl-header">
          <table cellpadding="0" cellspacing="0" border="0">
            <thead>
              <tr>
                <th>Spring Semester</th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="tbl-content">
          <table cellpadding="0" cellspacing="0" border="0">
            <tbody>
             {
                yearClasses[1].map((jsonObj) => {
                  return (
                    <tr>
                      <td>{jsonObj["title"]}</td>
                      <td>{jsonObj["credit_hours"]}</td>
                    </tr>
                  )})
             }
            </tbody>
          </table>
        </div>
            </div>
          </div>
      </section>
      )
  })
  
  return reactArr
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIdx: 0,
      plan: []
    }
    this.setPageIdx = this.setPageIdx.bind(this)
    this.setPlan = this.setPlan.bind(this)
  }
  
  setPageIdx(pageIdx) {
     this.setState(() => {return {pageIdx: pageIdx}})
  }
  
  setPlan(plan) {
     this.setState(() => {return {plan: plan}})
  }
  
  render() {
    return (
      <div id="main" 
        class="container-fluid" 
        >
        <Navbar throwPageIdx={this.setPageIdx}/>
        <CSSTransition
          in={this.state.pageIdx === 0}
          timeout={300}
          classNames="generic"
          unmountOnExit
          >
          <Form throwPageIdx={this.setPageIdx} throwPlan={this.setPlan}/>
        </CSSTransition>  
        <CSSTransition
          in={this.state.pageIdx === 1}
          timeout={300}
          classNames="generic"
          unmountOnExit
          >
          <Table semesterTables={this.state.plan}/>
        </CSSTransition>  
      </div>
    )
  }
}

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.onTitleClick = this.onTitleClick.bind(this)
  }
  
  onTitleClick() {
    this.props.throwPageIdx(0)
  }
  
  
  render() {
    return (
      <div id="navbar" 
        class="container-fluid" 
        >
        <h1 onClick={this.onTitleClick}>DegreeMap AI</h1>
      </div>
    )
  }
}

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courseText: "",
      echoText: "",
      major: "Computer Science",
      year: "Freshman",
      buttonsDisabled: false,
    };
    this.onAddCourse = this.onAddCourse.bind(this);
    this.onCourseInput = this.onCourseInput.bind(this);
    this.onSelectMajor = this.onSelectMajor.bind(this);
    this.onSelectYear = this.onSelectYear.bind(this)
    this.onGeneratePlan = this.onGeneratePlan.bind(this);
  }
  
  onAddCourse(event) {
    event.preventDefault();
    this.setState(prevState => {
      return{
        echoText: prevState.echoText + prevState.courseText,
        courseText: ""
      }
    })
  }
  
  onCourseInput(event) {
    this.setState(() => {return {courseText: event.target.value + "\n"}})
  }
  
  onSelectMajor(event) {
    this.setState(() => {return{major: event.target.value}})
  }
  
  onSelectYear(event) {
    this.setState(() => {return{year: event.target.value}})
  }
  
  onGeneratePlan(event) {
     event.preventDefault();
     // console.log(this.state.echoText)
     this.setState(() => {{return {buttonsDisabled: true}}}, () => {
       const jsonReq = {
         major: this.state.major,
         year: this.state.year,
         courses: this.state.echoText.split(/\r?\n/)
       }
       
       generatePlan(jsonReq).then((obj) => {
         this.props.throwPlan(tabulate(obj))
         this.props.throwPageIdx(1)
         this.setState(() => {return {
           courseText: "",
           echoText: "",
           major: "Computer Science",
           year: "Freshman",
           buttonsDisabled: false,
         }})
       })
     })
  }
  
  render() {
    return (
      <form onSubmit={this.onSignUp}>
        <label for="major">Select your Major</label>
        <select class="hover-expand-small" value={this.state.major} onChange={this.onSelectMajor} id="major" name="major">
          <option value="Computer Science">Computer Science</option>
          <option value="Business">Business</option>
          <option value="Philosophy">Philosophy</option>
        </select>
        
        
        <label for="course-list">Enter courses you have already taken (if any)</label>
        <div class="side-by-side">
          <div class="top-bottom">
            <input class="hover-expand-small" type="text" id="course-list" name="course" onChange={this.onCourseInput} value={this.state.courseText}/>
            <button class="button-63 hover-expand-big" onClick={this.onAddCourse} disabled={this.state.buttonsDisabled}>Add course</button>
          </div>
        <textarea id="course-echo" value={this.state.echoText}/>
        </div>
        
        <label for="college-year">Which year are you going into?</label>
        <div class="top-bottom">
        <select class="hover-expand-small" value={this.state.year} onChange={this.onSelectYear} id="college-year" name="year">
          <option value="Freshman">Freshman</option>
          <option value="Sophomore">Sophomore</option>
          <option value="Junior">Junior</option>
          <option value="Senior">Senior</option>
        </select>
        
        {this.state.buttonsDisabled ? <LoadingIcon /> : <button class="button-63 hover-expand-big" onClick={this.onGeneratePlan}>Generate Plan</button>}
        </div>
      </form>
    )
  }
}

class LoadingIcon extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>)
  }
}

class Table extends React.Component {
  constructor(props) {
    super(props)
  }
  
  render() {
    return (
      <div id="four-year-plan">
        {this.props.semesterTables}
      </div>
    )
  }
}

ReactDOM.render(<Main/>, document.querySelector("body"));