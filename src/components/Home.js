import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Image } from 'react-bootstrap';
import config from '../config';
import axios from 'axios';

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


    useEffect(() => {
        if (loading) {
            getAppData();
            setLoading(false);
        } else {
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [loading, searchInput]);

    const handleScroll = () => {
        if ((window.innerHeight + document.documentElement.scrollTop <= document.documentElement.offsetHeight) || loading) return;
        if (!searchText) setLoading(true);
    };

    const imageError = (e) => e.target.src = config.BASE_API_URL + "/images/placeholder_for_missing_posters.png";

    const getAppData = async () => {
        const appUrl = config.BASE_API_URL + "/data/page" + page + ".json";
        const toatalPage = Math.ceil(appData.total / appData['per-page']);
        if (toatalPage < page) return;

        await axios.get(appUrl)
            .then(res => {
                console.log(res);
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
        searchText = searchText.toLowerCase().trim();
        setSearchText(searchText);
        if (!searchText) return;
        setFilterData([]);
        const filteredList = data.filter((item => Object.values(item.name.toLowerCase()).some(value => value.includes(searchText))))
        console.log(filteredList);
        setFilterData([...filteredList]);
    }


    return (
        <Container fluid className='app-body'>
            <Row className='header-nav'>
                <Col xs={4} md={4} lg={4} className="headers-items">
                    <div>
                        <Image className='header-icon' src={leftArrow} alt="Back" />
                        <span>{appData && appData.title}</span>
                    </div>
                    <div>
                        {searchInput && <input className='search-input' onChange={(e) => { searchData(e.target.value) }} />}
                        <Image className='header-icon' src={searchIcon} alt="Search" onClick={() => setSearchInput(true)} />
                    </div>
                </Col>
            </Row>
            <Row className='items-container'>
                <Col xs={4} md={4} lg={4} className='list-container'>
                    {error && <p className='error-message'>Error: {error.message}</p>}
                    <ul className='item-container'>
                        {
                            searchText
                                ? filterData && filterData.map((items, i) => {
                                    return <li key={items["poster-image"] + i}><img src={config.BASE_API_URL + "/images/" + items["poster-image"]} onError={(e) => imageError(e)} alt={items["name"]} /> <p>{items["name"]}</p></li>
                                })
                                : data && data.map((items, i) => {
                                    return <li key={items["poster-image"] + i}><img src={config.BASE_API_URL + "/images/" + items["poster-image"]} onError={(e) => imageError(e)} alt={items["name"]} /> <p>{items["name"]}</p></li>
                                })
                        }
                    </ul>
                </Col>
            </Row>
        </Container>
    )
}

export default Home