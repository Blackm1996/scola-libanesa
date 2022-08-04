import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from '@mui/material';
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
  const { edit, delete1, noRecords, searchKey, teachers, actions } =
    langKeywords[pageLanguage];

    const thema=createTheme();
  return (
    <ThemeProvider theme={thema}>
    <MaterialTable
      options={{
        debounceInterval: 700,
        padding: "dense",
        actionsColumnIndex: -1,
      }}
      columns={props.columns}
      data={props.data}
      title={teachers}
      actions={[
        {
          icon: "edit",
          tooltip: `${edit}`,
          onClick: (event, rowData) => {
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
    /></ThemeProvider>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.language,
  };
};
export default connect(mapStateToProps)(TeachersTable);
