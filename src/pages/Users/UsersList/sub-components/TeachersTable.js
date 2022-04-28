import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { ENGLISH, FRENCH, PORTO } from "../../../../languages";
import { ENGLISHWORDS, FRENCHWORDS, PORTOWORDS } from "../LangKeys";
import { connect } from "react-redux";

const TeachersTable = (props) => {
  const [pageLanguage, setPageLanguage] = useState(props.language);

  const [langKeywords, setLangKeywords] = useState({
    [ENGLISH]: ENGLISHWORDS,
    [PORTO]: PORTOWORDS,
    [FRENCH]: FRENCHWORDS,
  });
  useEffect(() => {
    setPageLanguage(props.language);
  }, [props.language]);
  // Language KEywords
  const { edit, delete1, noRecords, searchKey, users, actions } =
    langKeywords[pageLanguage];

  return (
    <MaterialTable
      options={{
        debounceInterval: 700,
        padding: "dense",
        actionsColumnIndex: -1,
      }}
      columns={props.columns}
      data={props.data}
      title={users}
      actions={[
        {
          icon: "edit",
          tooltip: `${edit}`,
          onClick: (event, rowData) => {
            console.log(rowData);
            props.chooseUser(rowData, "Edit");
          },
        },
        {
          icon: "delete",
          tooltip: `${delete1}`,
          onClick: (event, rowData) => props.chooseUser(rowData, "Eliminar"),
        },
      ]} //onSearchChange={search}
      localization={{
        toolbar: {
          searchPlaceholder: `${searchKey}`,
        },
        body: {
          emptyDataSourceMessage: `${noRecords}`,
        },
        header: {
          actions: `${actions}`,
        },
      }}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.language,
  };
};
export default connect(mapStateToProps)(TeachersTable);
