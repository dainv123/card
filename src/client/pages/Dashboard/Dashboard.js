import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Layout, Row, Card, Table, Tag, Button } from 'antd';
import { deleteFile } from '../../utils/uploadFile';
import { mutations, queries } from '../../graphql/graphql';
import { SERVER_URI } from '../../constants/endpoint';
import LoggedLayout from '../../components/Layouts/LoggedLayout';
import ThemeModal from '../../components/ThemeModal/ThemeModal';
import CardModal from '../../components/CardModal/CardModal';
import BlogModal from '../../components/BlogModal/BlogModal';
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
    await DeleteCard({ variables: { id } });
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
        <a target="_blank" href={'/reader/' + encodeURIComponent(text)} rel="noreferrer">
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

  const responseTheme = isRoleAdmin && useQuery(queries.GET_THEMES);

  const dataTheme = (responseTheme && responseTheme.data && responseTheme.data.themes) || [];

  const onDeleteTheme = async (id, filename) => {
    await DeleteTheme({ variables: { id } });
    await responseTheme.refetch();
    deleteFile(filename);
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
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (text, record) => (
        <img
          src={SERVER_URI + record.image}
          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
        />
      )
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
          <Button type="danger" onClick={() => onDeleteTheme(record.id, record.image)}>
            Delete
          </Button>
        </>
      )
    }
  ];

  const [DeleteBlog] = useMutation(mutations.DELETE_BLOG);

  const [dataBlogPopup, setDataBlogPopup] = useState({});

  const [isOpenBlogPopup, setIsOpenBlogPopup] = useState(false);

  const responseBlog = isRoleAdmin && useQuery(queries.GET_BLOGS);

  const dataBlog = (responseBlog && responseBlog.data && responseBlog.data.blogs) || [];

  const onDeleteBlog = async (id, filename) => {
    await DeleteBlog({ variables: { id } });
    await responseBlog.refetch();
    deleteFile(filename);
  };

  const onOpenUpdateBlogPopup = record => {
    setDataBlogPopup(record);
    setIsOpenBlogPopup(true);
  };

  const showModalBlog = () => {
    setIsOpenBlogPopup(true);
  };

  const handleOkBlog = async () => {
    setIsOpenBlogPopup(false);
    await responseBlog.refetch();
  };

  const handleCancelBlog = () => {
    setIsOpenBlogPopup(false);
  };

  const columnsBlog = [
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
      title: 'Trend',
      dataIndex: 'trend',
      key: 'trend'
    },
    {
      title: 'Introduction',
      dataIndex: 'introduction',
      key: 'introduction'
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content'
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (text, record) => (
        <img
          src={SERVER_URI + record.image}
          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
        />
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <Button
            type="danger"
            onClick={() => onOpenUpdateBlogPopup(record)}
            style={{ marginRight: '6px' }}
          >
            Edit
          </Button>
          <Button type="danger" onClick={() => onDeleteBlog(record.id, record.image)}>
            Delete
          </Button>
        </>
      )
    }
  ];

  const [DeleteTag] = useMutation(mutations.DELETE_TAG);

  const [dataTagPopup, setDataTagPopup] = useState({});

  const [isOpenTagPopup, setIsOpenTagPopup] = useState(false);

  const responseTag = isRoleAdmin && useQuery(queries.GET_TAGS);

  const dataTag = (responseTag && responseTag.data && responseTag.data.tags) || [];

  const onDeleteTag = async id => {
    await DeleteTag({ variables: { id } });
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
                <Button type="primary" onClick={showModalBlog}>
                  ADD BLOG
                </Button>
                <BlogModal
                  data={dataBlogPopup}
                  isModalOpen={isOpenBlogPopup}
                  handleOk={handleOkBlog}
                  handleCancel={handleCancelBlog}
                ></BlogModal>
              </Row>
              <Row>
                <Table columns={columnsBlog} dataSource={dataBlog} rowKey={'id'}></Table>
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
