import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Layout, Row, Card, Table, Tag, Button } from 'antd';
import { mutations, queries } from '../../graphql/graphql';
import LoggedLayout from '../../components/Layouts/LoggedLayout';
import ThemeModal from '../../components/ThemeModal/ThemeModal';
import CardModal from '../../components/CardModal/CardModal';
import TagModal from '../../components/TagModal/TagModal';
import _s from './Dashboard.less';

const DashboardPage = () => {
  const user = useSelector(state => state.auth.user);

  const isRoleAdmin = user.role === 'ADMIN';

  const [DeleteCard] = useMutation(mutations.DELETE_CARD);

  const [dataCardPopup, setDataCardPopup] = useState({});

  const [isOpenCardPopup, setIsOpenCardPopup] = useState(false);

  const responseCard = useQuery(queries.GET_CARDS);

  const dataCard = (responseCard && responseCard.data && responseCard.data.cards) || [];

  const onDeleteCard = async id => {
    DeleteCard({ variables: { id } });
    await responseCard.refetch();
  };

  const onOpenUpdateCardPopup = record => {
    setDataCardPopup(record);
    setIsOpenCardPopup(true);
  };

  const showModalCard = () => {
    setIsOpenCardPopup(true);
  };

  const handleOkCard = async () => {
    setIsOpenCardPopup(false);
    await responseCard.refetch();
  };

  const handleCancelCard = () => {
    setIsOpenCardPopup(false);
  };

  const columnsCard = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a target="_blank" href={'/reader/' + record.id} rel="noreferrer">
          {text}
        </a>
      )
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
      render: text => (
        <>{(text || '').length > 100 ? (text || '').substring(0, 100) + '...' : text}</>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <Button
            type="danger"
            onClick={() => onOpenUpdateCardPopup(record)}
            style={{ marginRight: '6px' }}
          >
            Edit
          </Button>
          <Button type="danger" onClick={() => onDeleteCard(record.id)}>
            Delete
          </Button>
        </>
      )
    }
  ];

  const [DeleteTheme] = useMutation(mutations.DELETE_THEME);

  const [dataThemePopup, setDataThemePopup] = useState({});

  const [isOpenThemePopup, setIsOpenThemePopup] = useState(false);

  const responseTheme = useQuery(queries.GET_THEMES);

  const dataTheme = (responseTheme && responseTheme.data && responseTheme.data.themes) || [];

  const onDeleteTheme = async id => {
    DeleteTheme({ variables: { id } });
    await responseTheme.refetch();
  };

  const onOpenUpdateThemePopup = record => {
    setDataThemePopup(record);
    setIsOpenThemePopup(true);
  };

  const showModalTheme = () => {
    setIsOpenThemePopup(true);
  };

  const handleOkTheme = async () => {
    setIsOpenThemePopup(false);
    await responseTheme.refetch();
  };

  const handleCancelTheme = () => {
    setIsOpenThemePopup(false);
  };

  const columnsTheme = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a target="_blank" href={record.path} rel="noreferrer">
          {text}
        </a>
      )
    },
    {
      title: 'Path',
      dataIndex: 'path',
      key: 'path'
    },
    {
      title: 'Tag(s)',
      dataIndex: 'tags',
      key: 'tags',
      render: (text, record) => (
        <>
          {record.tags.map(item => (
            <Tag key={item.id} color="blue">
              {item.name}
            </Tag>
          ))}
        </>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <Button
            type="danger"
            onClick={() => onOpenUpdateThemePopup(record)}
            style={{ marginRight: '6px' }}
          >
            Edit
          </Button>
          <Button type="danger" onClick={() => onDeleteTheme(record.id)}>
            Delete
          </Button>
        </>
      )
    }
  ];

  const [DeleteTag] = useMutation(mutations.DELETE_TAG);

  const [dataTagPopup, setDataTagPopup] = useState({});

  const [isOpenTagPopup, setIsOpenTagPopup] = useState(false);

  const responseTag = useQuery(queries.GET_TAGS);

  const dataTag = (responseTag && responseTag.data && responseTag.data.tags) || [];

  const onDeleteTag = async id => {
    DeleteTag({ variables: { id } });
    await responseTag.refetch();
  };

  const onOpenUpdateTagPopup = record => {
    setDataTagPopup(record);
    setIsOpenTagPopup(true);
  };

  const showModalTag = () => {
    setIsOpenTagPopup(true);
  };

  const handleOkTag = async () => {
    setIsOpenTagPopup(false);
    await responseTag.refetch();
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
          <Button
            type="danger"
            onClick={() => onOpenUpdateTagPopup(record)}
            style={{ marginRight: '6px' }}
          >
            Edit
          </Button>
          <Button type="danger" onClick={() => onDeleteTag(record.id)}>
            Delete
          </Button>
        </>
      )
    }
  ];

  return (
    <LoggedLayout>
      <Layout.Content>
        <div className={_s.container}>
          <Row>
            <Button type="primary" onClick={showModalCard}>
              ADD CARD
            </Button>
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
          {isRoleAdmin && (
            <>
              <Row>
                <Button type="primary" onClick={showModalTheme}>
                  ADD THEME
                </Button>
                <ThemeModal
                  data={dataThemePopup}
                  tags={dataTag}
                  isModalOpen={isOpenThemePopup}
                  handleOk={handleOkTheme}
                  handleCancel={handleCancelTheme}
                ></ThemeModal>
              </Row>
              <Row>
                <Table columns={columnsTheme} dataSource={dataTheme} rowKey={'id'}></Table>
              </Row>
              <Row>
                <Button type="primary" onClick={showModalTag}>
                  ADD TAG
                </Button>
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
            </>
          )}
        </div>
      </Layout.Content>
    </LoggedLayout>
  );
};

export default DashboardPage;
