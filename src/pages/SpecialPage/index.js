import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Wrapper, Text, Title } from "./shared/style/Style.style";
import { getDataForTesting } from "./shared/api/api";
import FirstCom from "./shared/components/FirstCom";
import SecondComp from "./shared/components/SecondComp";

import { ENGLISH, FRENCH, PORTO } from "../../languages";
import {
  ENGLISHWORDS,
  FRENCHWORDS,
  PORTOWORDS,
} from "./shared/language/LangKeys";

const SpecialPage = (props) => {
  const [data, setData] = useState([]);
  const [pageLanguage, setPageLanguage] = useState(props.language);
  const [langKeywords, setLangKeywords] = useState({
    [ENGLISH]: ENGLISHWORDS,
    [PORTO]: PORTOWORDS,
    [FRENCH]: FRENCHWORDS,
  });
  const { name, prename } = langKeywords[pageLanguage];

  useEffect(() => {
    setPageLanguage(props.language);
  }, [props.language]);

  useEffect(() => {
    getDataForTesting().then((resp) => {
      //console.log('resp', resp.data)
      setData(resp.data);
    });
  }, []);

  return (
    <Wrapper>
      <Title>Title</Title>

      {data.map((item, index) => (
        <Text key={index}>
          {name}: {item.name}
        </Text>
      ))}

      <FirstCom />

      <SecondComp />
    </Wrapper>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.language,
  };
};

export default connect(mapStateToProps)(SpecialPage);
