import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Image } from 'react-bootstrap';
import config from '../config';
import axios from 'axios';
import Popup from './Popup';

const leftArrow = config.BASE_API_URL + "/images/Back.png";
const searchIcon = config.BASE_API_URL + "/images/search.png";

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [appData, setAppData] = useState({ "title": "", "total": 0, "per-page": 0 });

    const [searchInput, setSearchInput] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filterData, setFilterData] = useState([]);
    const [filterMessage, setFilterMessage] = useState('');

    const [show, setShow] = useState(false);
    const scrollContent = document.querySelector('.list-container');

    useEffect(() => {
        if (loading) {
            getAppData();
            setLoading(false);
        } else {
            scrollContent.addEventListener('scroll', handleScroll);
            return () => scrollContent.removeEventListener('scroll', handleScroll);
        }
    }, [loading, searchInput]);

    const handleScroll = () => {
        if ((scrollContent.innerHeight + document.documentElement.scrollTop <= document.documentElement.offsetHeight) || loading) return;
        if (!searchText) setLoading(true);
    };

    const imageError = (e) => e.target.src = config.BASE_API_URL + "/images/placeholder_for_missing_posters.png";

    const getAppData = async () => {
        const appUrl = config.BASE_API_URL + "/data/page" + page + ".json";
        const toatalPage = Math.ceil(appData.total / appData['per-page']);
        if (toatalPage < page) return;

        await axios.get(appUrl)
            .then(res => {
                if (res.status == 200) {
                    setData([...data, ...res.data.page["content-items"]["content"]]);
                    setAppData({ "title": res.data.page.title, "total": res.data.page["total-content-items"], "per-page": res.data.page["page-size-requested"] });
                    setPage(prev => prev + 1);
                    setLoading(false);
                } else setError({ message: "Data not available." });
            })
            .catch(error => {
                console.log(error);
                setError(error);
            });
    };

    const searchData = (searchText) => {
        const filter = setTimeout(() => {
            searchText = searchText.toLowerCase().trim();
            setSearchText(searchText);
            if (!searchText) return;
            setFilterData([]);
            const filteredList = data.filter(
                item => {
                    return (
                        item
                            .name
                            .toLowerCase()
                            .includes(searchText.toLowerCase())
                    );
                }
            );
            filteredList.length < 1 ? setFilterMessage('No match found') : setFilterMessage('');
            setFilterData([...filteredList]);
        }, 2000);

        return () => clearTimeout(filter);
    }

    const getHighlightedText = (text, highlight) => {
        // Split on highlight term and include term into parts, ignore case
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return <span> {parts.map((part, i) =>
            <span key={i} style={part.toLowerCase() === highlight.toLowerCase() ? { fontWeight: 'bold', color: 'green' } : {}}>
                {part}
            </span>)
        } </span>;
    };


    return (
        <Container fluid className='app-body text-center d-grid justify-content=center'>
            {show && <Popup show={show} onHide={() => setShow(false)} />}
            <Row>
                <Col xs={12} md={12} lg={12} className="headers-items">
                    <div onClick={() => setSearchInput(false)}>
                        <Image className='header-icon' src={leftArrow} alt="Back" onClick={() => setShow(true)} />
                        <span>{appData && appData.title}</span>
                    </div>
                    <div>
                        {searchInput && <input className='search-input' onChange={(e) => { searchData(e.target.value) }} />}
                        <Image className='header-icon' src={searchIcon} alt="Search" onClick={() => setSearchInput(!searchInput)} />
                    </div>
                </Col>
            </Row>
            <Row className='items-container' onClick={() => setSearchInput(false)}>
                <Col xs={12} md={12} lg={12} className='list-container p-0'>
                    {error && <p className='error-message'>Error: {error.message}</p>}
                    <ul className='item-container'>

                        {
                            !filterMessage
                                ? searchText
                                    ? filterData && filterData.map((items, i) => {
                                        return <li key={items["poster-image"] + i}><img src={config.BASE_API_URL + "/images/" + items["poster-image"]} onError={(e) => imageError(e)} alt={items["name"]} /> <p>{getHighlightedText(items["name"], searchText)}</p></li>
                                    })
                                    : data && data.map((items, i) => {
                                        return <li key={items["poster-image"] + i}><img src={config.BASE_API_URL + "/images/" + items["poster-image"]} onError={(e) => imageError(e)} alt={items["name"]} /> <p>{items["name"]}</p></li>
                                    })
                                : <p className='error-message'>No match found</p>
                        }
                    </ul>
                </Col>
            </Row>
        </Container>
    )
}

export default Home