import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from 'antd';
import { NavLink } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';
import { queries } from '../../graphql/graphql';
import PublicLayout from '../../components/Layouts/PublicLayout';
import { SERVER_URI, BLOG_URI, GET_FILE_URI } from '../../constants/endpoint';
import { ALL, PROJECT, THEME, THEME_INTRO } from '../../constants/wording';

const ThemePage = () => {
  const loggedIn = useSelector(state => state.auth.loggedIn);

  const [current, setCurrent] = useState('0');

  const responseTheme = useQuery(loggedIn ? queries.GET_THEMES : queries.GET_PUBLIC_THEMES);

  const dataTheme =
    (responseTheme &&
      responseTheme.data &&
      (responseTheme.data.themes || responseTheme.data.publicThemes)) ||
    [];

  const responseTag = useQuery(loggedIn ? queries.GET_TAGS : queries.GET_PUBLIC_TAGS);

  const dataTag =
    (responseTag && responseTag.data && (responseTag.data.tags || responseTag.data.publicTags)) ||
    [];

  const counter = (dataTheme, tagId) =>
    dataTheme.filter(theme => theme.tags.some(tag => tag.id == tagId)).length;

  const formatCount = count => (count > 9 ? count : '0' + count);

  const themeFiltered = useMemo(
    () =>
      current != '0'
        ? dataTheme.filter(theme => theme.tags.some(tag => tag.id == current))
        : dataTheme,
    [dataTheme, current]
  );

  const themeFilteredCount = useMemo(() => themeFiltered.length, [themeFiltered]);

  return (
    <PublicLayout>
      <Layout.Content>
        <section id="portfolio" className="sub-page">
          <div className="sub-page-inner">
            <div className="section-title">
              <div className="main-title">
                <div className="title-main-page">
                  <h4>{THEME}</h4>
                  <p>{THEME_INTRO}</p>
                </div>
              </div>
            </div>

            <div className="section-content">
              <div className="filter-tabs">
                <button
                  className={current === '0' ? 'fil-cat active-filter' : 'fil-cat'}
                  data-rel="all"
                  onClick={() => setCurrent('0')}
                >
                  {ALL}
                </button>
                {dataTag &&
                  dataTag.map(tag => {
                    const count = counter(dataTheme, tag.id);
                    return (
                      !!count && (
                        <button
                          className={current === tag.id ? 'fil-cat active-filter' : 'fil-cat'}
                          onClick={() => setCurrent(tag.id)}
                          key={tag.id}
                        >
                          <span>{formatCount(count)}</span> {tag.name}
                        </button>
                      )
                    );
                  })}
              </div>

              <div className="portfolio-grid portfolio-trigger" id="portfolio-page">
                <div className="label-portfolio">
                  <span className="rotated-sub">{PROJECT}</span>
                  <span className="project-count">{themeFilteredCount}</span>
                </div>
                <div className="row">
                  {themeFiltered &&
                    themeFiltered.map(theme => (
                      <>
                        <div
                          className="col-lg-6 col-md-6 col-sm-12 col-xs-12 portfolio-item website all"
                          key={theme.id}
                        >
                          <div className="portfolio-img">
                            <img src={GET_FILE_URI + theme.image} className="img-responsive" alt="theme" />
                          </div>
                          <div className="portfolio-data">
                            <h4>
                              <a href={theme.path} target="_blank">{theme.name}</a>
                            </h4>
                            <p class="meta">{theme.tags.map(i => i.name).join(', ')}</p>
                            <div className="portfolio-attr">
                              <a href={theme.path} target="_blank">
                                <i className="lnr lnr-link"></i>
                              </a>
                              <a
                                href={GET_FILE_URI + theme.image}
                                data-rel="lightcase:gal"
                                title={theme.name}
                              >
                                <i className="lnr lnr-move"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout.Content>
    </PublicLayout>
  );
};

export default ThemePage;
