import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Card, Table, Tag, Button } from 'antd';
import { mutations, queries } from '../../graphql/graphql';
import ThemeModal from '../../components/ThemeModal/ThemeModal';
import LoggedLayout from '../../components/Layouts/LoggedLayout';
import CardModal from '../../components/CardModal/CardModal';

const DashboardPage = () => {
  const [DeleteCard] = useMutation(mutations.DELETE_CARD);

  const [dataCardPopup, setDataCardPopup] = useState({});

  const [isOpenCardPopup, setIsOpenCardPopup] = useState(false);

  const responseCard = useQuery(queries.GET_CARDS);

  const dataCard = (responseCard && responseCard.data && responseCard.data.cards) || [];

  const onDeleteCard = id => DeleteCard({ variables: { id } });

  const onOpenUpdateCardPopup = record => {
    setDataCardPopup(record);
    setIsOpenCardPopup(true);
  };

  const showModalCard = () => {
    setIsOpenCardPopup(true);
  };

  const handleOkCard = () => {
    setIsOpenCardPopup(false);
  };

  const handleCancelCard = () => {
    setIsOpenCardPopup(false);
  };

  const columnsCard = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: text => <a>{text}</a>
    },
    {
      title: 'Theme',
      dataIndex: 'themeName',
      key: 'themeName'
    },
    {
      title: 'Config',
      dataIndex: 'config',
      key: 'config'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <a onClick={() => onOpenUpdateCardPopup(record)}>Edit</a>
          <a onClick={() => onDeleteCard(record.id)}>Delete</a>
        </>
      )
    }
  ];

  const [DeleteTheme] = useMutation(mutations.DELETE_THEME);

  const [dataThemePopup, setDataThemePopup] = useState({});

  const [isOpenThemePopup, setIsOpenThemePopup] = useState(false);

  const responseTheme = useQuery(queries.GET_THEMES);

  const dataTheme = (responseTheme && responseTheme.data && responseTheme.data.themes) || [];

  const onDeleteTheme = id => DeleteTheme({ variables: { id } });

  const onOpenUpdateThemePopup = record => {
    setDataThemePopup(record);
    setIsOpenThemePopup(true);
  };

  const showModalTheme = () => {
    setIsOpenThemePopup(true);
  };

  const handleOkTheme = () => {
    setIsOpenThemePopup(false);
  };

  const handleCancelTheme = () => {
    setIsOpenThemePopup(false);
  };

  const columnsTheme = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>
    },
    {
      title: 'Path',
      dataIndex: 'path',
      key: 'path'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <a onClick={() => onOpenUpdateThemePopup(record)}>Edit</a>
          <a onClick={() => onDeleteTheme(record.id)}>Delete</a>
        </>
      )
    }
  ];

  return (
    <LoggedLayout>
      <Button type="primary" onClick={showModalTheme}>
        Add/Edit
      </Button>

      <ThemeModal
        data={dataThemePopup}
        isModalOpen={isOpenThemePopup}
        handleOk={handleOkTheme}
        handleCancel={handleCancelTheme}
      ></ThemeModal>

      <Table columns={columnsTheme} dataSource={dataTheme} rowKey={'id'}></Table>

      <Button type="primary" onClick={showModalCard}>
        Select Theme
      </Button>

      <CardModal
        data={dataCardPopup}
        themes={dataTheme}
        isModalOpen={isOpenCardPopup}
        handleOk={handleOkCard}
        handleCancel={handleCancelCard}
      ></CardModal>

      <Table columns={columnsCard} dataSource={dataCard} rowKey={'id'}></Table>
    </LoggedLayout>
  );
};

export default DashboardPage;
