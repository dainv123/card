import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { deleteFile } from '../../utils/uploadFile';
import { mutations, queries } from '../../graphql/graphql';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Layout, Row, Card, Table, Tag, Button, message } from 'antd';
import { BLOG_URI, SERVER_URI, GET_FILE_URI } from '../../constants/endpoint';
import { COPY_CLIPBOARD_ERROR, COPY_CLIPBOARD_OK } from '../../constants/wording';
import PrivateLayout from '../../components/Layouts/PrivateLayout';
import ThemeModal from '../../components/ThemeModal/ThemeModal';
import ImageModal from '../../components/ImageModal/ImageModal';
import CardModal from '../../components/CardModal/CardModal';
import BlogModal from '../../components/BlogModal/BlogModal';
import TagModal from '../../components/TagModal/TagModal';
import _s from './Dashboard.less';

const DashboardPage = () => {
  const user = useSelector(state => state.auth.user);

  const isRoleAdmin = user.role === 'ADMIN';

  // IMAGE:
  const [DeleteImage] = useMutation(mutations.DELETE_IMAGE);

  const [dataImagePopup, setDataImagePopup] = useState({});

  const [isOpenImagePopup, setIsOpenImagePopup] = useState(false);

  const responseImage = useQuery(queries.GET_IMAGES);

  const dataImage = (responseImage && responseImage.data && responseImage.data.images) || [];

  const onDeleteImage = async (id, filename) => {
    await DeleteImage({ variables: { id } });
    await responseImage.refetch();
    deleteFile(filename);
  };

  const onOpenUpdateImagePopup = record => {
    setDataImagePopup(record);
    setIsOpenImagePopup(true);
  };

  const showModalImage = () => {
    setIsOpenImagePopup(true);
  };

  const handleOkImage = async () => {
    setIsOpenImagePopup(false);
    await responseImage.refetch();
  };

  const handleCancelImage = () => {
    setDataImagePopup({});
    setIsOpenImagePopup(false);
  };

  const handleCopyImage = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => message.success(COPY_CLIPBOARD_OK))
      .catch(err => message.error(COPY_CLIPBOARD_ERROR));
  };

  const columnsImage = [
    {
      title: 'Name',
      dataIndex: 'image',
      key: 'name',
      render: (text, record) => (
        <a target="_blank" href={GET_FILE_URI + record.image} rel="noreferrer">{text}</a>
      )
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (text, record) => (
        <img src={GET_FILE_URI + record.image} style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div className={_s.alignRight}>
          <Button type="dashed" onClick={() => handleCopyImage(GET_FILE_URI + record.image)} style={{ marginRight: '6px' }}>
            Copy
          </Button>
          <Button type="default" onClick={() => onOpenUpdateImagePopup(record)} style={{ marginRight: '6px' }}>
            Edit
          </Button>
          <Button type="danger" onClick={() => onDeleteImage(record.id, record.image)}>
            Delete
          </Button>
        </div>
      )
    }
  ];

  // CARD
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
    setDataCardPopup({});
    setIsOpenCardPopup(false);
  };

  const columnsCard = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a target="_blank" href={'/reader/' + encodeURIComponent(text)} rel="noreferrer">{text}</a>
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
        <div className={_s.alignRight}>
          <Button type="default" onClick={() => onOpenUpdateCardPopup(record)} style={{ marginRight: '6px' }}>
            Edit
          </Button>
          <Button type="danger" onClick={() => onDeleteCard(record.id)}>
            Delete
          </Button>
        </div>
      )
    }
  ];

  // THEME
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
    setDataThemePopup({});
    setIsOpenThemePopup(false);
  };

  const columnsTheme = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a target="_blank" href={record.path} rel="noreferrer">{text}</a>
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
        <img src={GET_FILE_URI + record.image} style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
      )
    },
    {
      title: 'Tag(s)',
      dataIndex: 'tags',
      key: 'tags',
      render: (text, record) => (
        <>
          {record.tags.map(item => <Tag key={item.id} color="blue">{item.name}</Tag>)}
        </>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div className={_s.alignRight}>
          <Button type="default" onClick={() => onOpenUpdateThemePopup(record)} style={{ marginRight: '6px' }}>
            Edit
          </Button>
          <Button type="danger" onClick={() => onDeleteTheme(record.id, record.image)}>
            Delete
          </Button>
        </div>
      )
    }
  ];

  // BLOG
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
    setDataBlogPopup({});
    setIsOpenBlogPopup(false);
  };

  const columnsBlog = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a target="_blank" href={BLOG_URI + text} rel="noreferrer">{text}</a>
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
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (text, record) => (
        <img src={GET_FILE_URI + record.image} style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div className={_s.alignRight}>
          <Button type="default" onClick={() => onOpenUpdateBlogPopup(record)} style={{ marginRight: '6px' }}>
            Edit
          </Button>
          <Button type="danger" onClick={() => onDeleteBlog(record.id, record.image)}>
            Delete
          </Button>
        </div>
      )
    }
  ];

  // TAG
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
    setDataTagPopup({});
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
        <div className={_s.alignRight}>
          <Button type="default" onClick={() => onOpenUpdateTagPopup(record)} style={{ marginRight: '6px' }}>
            Edit
          </Button>
          <Button type="danger" onClick={() => onDeleteTag(record.id)}>
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <PrivateLayout>
      <Layout.Content>
        <div className={_s.container}>
          <Row className={_s.alignRight}>
            <Button type="primary" onClick={showModalImage}>
              ADD IMAGE
            </Button>
            <ImageModal
              data={dataImagePopup}
              isModalOpen={isOpenImagePopup}
              handleOk={handleOkImage}
              handleCancel={handleCancelImage}
            ></ImageModal>
          </Row>
          <Row>
            <Table columns={columnsImage} dataSource={dataImage} rowKey={'id'}></Table>
          </Row>
          <Row className={_s.alignRight}>
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
              <Row className={_s.alignRight}>
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
              
              <Row className={_s.alignRight}>
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

              <Row className={_s.alignRight}>
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
            </>
          )}
        </div>
      </Layout.Content>
    </PrivateLayout>
  );
};

export default DashboardPage;
