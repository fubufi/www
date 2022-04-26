import React, {useState} from "react";

const FAQSection = (props) => {
  const [show, setShow] = useState(props.open || false);
  const glyph = show ? "[-]" : "[+]";
  return (
    <div className="faq-section">
      <div className="faq-question" onClick={() => {setShow(!show)}}>
        {props.question}
        <span className="grow"></span>
        <span style={{marginRight: "50px"}} className="clickable">{glyph}</span>
      </div>
      {show && <div className="faq-body">{props.children}</div>}
    </div>
  );
}

const About = () => {
  return (
    <div className="faq-main">
      <FAQSection question="What is this all about?" open={true}>
        <p>
          Fubufi, wtf?
        </p>
        <p>
          Indeed.
        </p>
      </FAQSection>
    </div>
  );
}

export default About;
