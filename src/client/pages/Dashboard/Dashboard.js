import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Layout, Row, Card, Table, Tag, Button } from 'antd';
import { mutations, queries } from '../../graphql/graphql';
import LoggedLayout from '../../components/Layouts/LoggedLayout';
import ThemeModal from '../../components/ThemeModal/ThemeModal';
import CardModal from '../../components/CardModal/CardModal';
import TagModal from '../../components/TagModal/TagModal';

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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <a target='_blank' href={'/reader/' + record.id}>{text}</a>
    },
    {
      title: 'Theme',
      dataIndex: 'themeName',
      key: 'themeName'
    },
    {
      title: 'Config',
      dataIndex: 'config',
      key: 'config',
      render: text => <>{(text || '').length > 100 ? (text || '').substring(0, 100) + '...' : text}</>
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
      render: (text, record) => <a target='_blank' href={record.path}>{text}</a>
    },
    {
      title: 'Path',
      dataIndex: 'path',
      key: 'path'
    },
    {
      title: 'Tag(s)',
      dataIndex: 'tag',
      key: 'tag'
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

  
  const [DeleteTag] = useMutation(mutations.DELETE_TAG);

  const [dataTagPopup, setDataTagPopup] = useState({});

  const [isOpenTagPopup, setIsOpenTagPopup] = useState(false);

  const responseTag = useQuery(queries.GET_TAGS);

  const dataTag = (responseTag && responseTag.data && responseTag.data.tags) || [];

  const onDeleteTag = id => DeleteTag({ variables: { id } });

  const onOpenUpdateTagPopup = record => {
    setDataTagPopup(record);
    setIsOpenTagPopup(true);
  };

  const showModalTag = () => {
    setIsOpenTagPopup(true);
  };

  const handleOkTag = () => {
    setIsOpenTagPopup(false);
  };

  const handleCancelTag = () => {
    setIsOpenTagPopup(false);
  };

  const columnsTag = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <a onClick={() => onOpenUpdateTagPopup(record)}>Edit</a>
          <a onClick={() => onDeleteTag(record.id)}>Delete</a>
        </>
      )
    }
  ];

  return (
    <LoggedLayout>
      <Layout.Content>
        <Row>
          <Button type="primary" onClick={showModalTheme}>add/edit THEME</Button>
          <ThemeModal
            data={dataThemePopup}
            isModalOpen={isOpenThemePopup}
            handleOk={handleOkTheme}
            handleCancel={handleCancelTheme}
          ></ThemeModal>
        </Row>
        <Row>
          <Table columns={columnsTheme} dataSource={dataTheme} rowKey={'id'}></Table>
        </Row>
        <Row>
          <Button type="primary" onClick={showModalCard}>add/edit CARD</Button>
          <CardModal
            data={dataCardPopup}
            themes={dataTheme}
            isModalOpen={isOpenCardPopup}
            handleOk={handleOkCard}
            handleCancel={handleCancelCard}
          ></CardModal>
        </Row>
        <Row>
          <Table columns={columnsCard} dataSource={dataCard} rowKey={'id'}></Table>
        </Row>
        <Row>
          <Button type="primary" onClick={showModalTag}>add/edit TAG</Button>
          <TagModal
            data={dataTagPopup}
            isModalOpen={isOpenTagPopup}
            handleOk={handleOkTag}
            handleCancel={handleCancelTag}
          ></TagModal>
        </Row>
        <Row>
          <Table columns={columnsTag} dataSource={dataTag} rowKey={'id'}></Table>
        </Row>
      </Layout.Content>
    </LoggedLayout>
  );
};

export default DashboardPage;
