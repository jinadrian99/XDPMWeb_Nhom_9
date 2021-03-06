import React, { Component } from 'react';
import { Container, Col, Row, Table } from 'reactstrap';
// import { BsDiamondHalf } from 'react-icons/bs';
import Footer from '../Footer/Footer';
import NavTop from '../Navigation/NavTop';
import AOS from 'aos';
import 'aos/dist/aos.css'; 

import './Team.scss';
import { link } from '../../link';
const http = link;

export default class Rates extends Component {
    constructor(props) {
        super(props);
        this.state={
            roomType: [],
            slItemAddCart: 0
        }
    }

    loadRoomTypes(){
        axios.get(http + '/api/room_types').then( response => {
            this.setState({
                roomType: response.data
            })
        });
    }

    componentWillMount(){
        this.setState({
            slItemAddCart: localStorage.getItem('slItemsShoppingCart') ? parseInt(localStorage.getItem('slItemsShoppingCart'),10) : 0
        })
        this.loadRoomTypes();
    }


    componentDidMount() {
        window.scrollTo(0, 0);
    }
    
    render() {
        AOS.init();
        var aos_flip_left = {
            'data-aos': 'flip-left',
            'data-aos-offset': '350'
        } 
        return (
            <>
                <NavTop slItemAddCart = {this.state.slItemAddCart} />
                {/* <img src='./public/image/team-3393037_1920.jpg'/> */}
                <div style={{ marginTop: "7vh" }}/>
                <Container>
                    <Row className="row-title">
                        <Col className="text-center">
                            <span className="text-title">
                                <span className="text-title-head">N</span>ATIVE 
                                <span className="text-title-head"> H</span>OTEL
                                <span className="text-title-head"> T</span>EAM 
                                <span className="text-title-head"> W</span>ORK
                            </span>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="text-center">
                            <span className="text-title minimize-font">We are a team, we're always win</span>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '3vh' }}>
                        <Col>
                            <Table className="text-title rates-font-size" hover>
                                <thead>
                                    <tr>
                                        <th style={{width: '20vw'}}>H??? t??n</th>
                                        <th style={{width: '25vw'}}>MSSV</th>
                                        <th style={{width: '40vw'}}>Ch???c v???</th>
                                        <th style={{width: '15vw'}}>L???p</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Tr???n Qu???c H??ng</td>
                                        <td>DH51700402</td>
                                        <td>C??? ????ng l???n nh???t</td>
                                        <td>D17-TH01</td>
                                    </tr>
                                    <tr>
                                        <td>Tri???u Uy Ph??</td>
                                        <td>DH51501994</td>
                                        <td>T???ng gi??m ?????c</td>
                                        <td>D17-TH01</td>
                                    </tr>
                                    <tr>
                                        <td>Tr???nh Ph?????c T??n</td>
                                        <td>DH51700160</td>
                                        <td>Ph?? t???ng gi??m ?????c</td>
                                        <td>D17-TH01</td>
                                    </tr>
                                    <tr>
                                        <td>????? Ng???c Ho??ng H??n</td>
                                        <td>DH51701278</td>
                                        <td>Gi??m ?????c ??i???u h??nh</td>
                                        <td>D17-TH09</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
                <Footer />
            </>
        )
    }
}
