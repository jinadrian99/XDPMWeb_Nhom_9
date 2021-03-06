import React, { Component } from 'react'
import { 
    Table,
    Row,
    Col,
    Input,
    Form,
    FormGroup,
    Label,
    Button,
    Tooltip
} from 'reactstrap';
import { Link } from 'react-router-dom';
import NavbarTop from '../../Navigation/NavbarTop/NavbarTop';
import SidebarLeft from '../../Navigation/Sidebar/SidebarLeft';
import { ImCancelCircle } from "react-icons/im";
import axios from 'axios';
import { link } from '../../../../link';
const http = link;

export default class AddRoomType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tenLP: '',
            hinhAnh: '',
            moTa: '',
            mtGT:'',
            mtTQ:'',
            slNguoi: 1,
            phongTam: 1,
            soGiuong: 1,
            slPhongTrong: '',

            formdata:'',
            
            chooseImageDevive: true,
            tooltipOpen: false
        }
        this.resetForm = this.resetForm.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.submitRoomType = this.submitRoomType.bind(this);
        this.handleClickSlNguoi = this.handleClickSlNguoi.bind(this);
        this.handleClickSoGiuong = this.handleClickSoGiuong.bind(this);
        this.handleClickPhongTam = this.handleClickPhongTam.bind(this);
        
        this.changeStateImage = this.changeStateImage.bind(this);
        this.chooseImageUrlOrDevice = this.chooseImageUrlOrDevice.bind(this);
        this.fileSelectHandle = this.fileSelectHandle.bind(this);
    }

    toggle(){
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        })
    }

    resetForm(){
        this.setState({
            tenLP: '',
            hinhAnh: '',
            moTa: '',
            slPhongTrong: ''
        })
    }

    handleClickSlNguoi(v){
        if(v==0){
            this.setState({slNguoi: 1});
        } 
        else if (v==1) {
            this.setState({slNguoi: 2});
        }
        else {
            this.setState({slNguoi: 4});
        }
    }

    handleClickPhongTam(v){
        if(v==0){
            this.setState({phongTam: 1});
        } else {
            this.setState({phongTam: 2});
        }
    }

    handleClickSoGiuong(v){
        if(v==0){
            this.setState({soGiuong: 1});
        } else {
            this.setState({soGiuong: 2});
        }
    }

    handleChange(e){
        this.setState({
            [e.target.name] : e.target.value
        });
    }

    changeStateImage(){
        console.log(this.state.chooseImageDevive);
        this.setState({
            chooseImageDevive: !this.state.chooseImageDevive
        });
    }

    chooseImageUrlOrDevice(){
        if(this.state.chooseImageDevive){
            return <Input type="file" name="hinhAnh" onChange={this.fileSelectHandle} multiple/>;
        } else {
            return <Input type="text" name="hinhAnh" placeholder="http://....jpg" required onChange={this.handleChange}/>;
        }
    }

    fileSelectHandle(e){
        this.setState({
            hinhAnh: e.target.files,
        })
        // // move upload file 
        // var files = e.target.files;
        // var fd = new FormData();
        // for (let i = 0; i < files.length; i++) {
        //     const file = files[i];   
        //     console.log(file);
        //     fd.append('data[]', file);
        // }
        // console.log(fd.getAll('data[]'));
        // axios.post(http + '/api/room_types_upload_file', fd, {
        //     headers: {
        //         "Content-Type": "multipart/form-data",
        //     }
        // })
        // .then(res=>{
        //     console.log(res.data);
        // }).catch(err=>{
        //     console.log(err);
        // })

        // var imgsraw = e.target.files;
        // // console.log(imgsraw);
        // var imgs = [];
        // for (let i = 0; i < imgsraw.length; i++) {
        //     imgs.push('/image/'+imgsraw[i].name);
        // }
        // // console.log(imgs);
        // imgs = JSON.stringify(imgs);
        // this.setState({
        //     hinhAnh: imgs
        // }, ()=>{ console.log(this.state.hinhAnh); });
    }

    submitRoomType(e){
        e.preventDefault();

        // move upload file 
        var files = this.state.hinhAnh;
        var fd = new FormData();
        for (let i = 0; i < files.length; i++) {
            const file = files[i];   
            console.log(file);
            fd.append('data[]', file);
        }
        console.log('value fd: ',fd.getAll('data[]'));
        axios.post(http + '/api/room_types_upload_file', fd, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
        .then(res=>{
            if(res.data == "Kh??ng c?? h??nh"){
                alert('kh??ng c?? h??nh');
                return;
            }
            console.log('c?? h??nh');

            // Convert to JSON
            var imgsraw = res.data;

            var des = [];
            des.push(this.state.mtGT);
            des.push(this.state.mtTQ);
            des.push(this.state.slNguoi);
            des.push(this.state.phongTam);
            des.push(this.state.soGiuong);

            console.log(imgsraw);
            var imgs = [];
            for (let i = 0; i < imgsraw.length; i++) {
                imgs.push('/image/'+imgsraw[i]);
            }
            console.log(imgs);
            imgs = JSON.stringify(imgs);

            des = JSON.stringify(des);
            console.log(des);
            this.setState({
                hinhAnh: imgs,
                moTa: des
            }, ()=>{ 
                // upload to db
                const roomType = {
                    tenLP: this.state.tenLP,
                    hinhAnh: this.state.hinhAnh,
                    moTa: this.state.moTa,
                    slPhongTrong: this.state.slPhongTrong
                }
                console.log('value room: ',roomType);
                axios.post(http + '/api/room_types', roomType).then(res => {
                    if (res.data != null) {
                        this.resetForm();
                        alert("Th??m lo???i ph??ng th??nh c??ng");
                    }
                }); 
            });
        }).catch(err=>{
            console.log(err);
        })
    }
    
    render() {
        return (
            <div>
                <Row>
                    <Col>
                        <NavbarTop />
                    </Col>
                </Row>
                <Row>
                    <Col md="2" style={{paddingRight: '0',paddingRight: '0px', height: '92vh'}}>
                        <SidebarLeft />
                    </Col>
                    <Col md="10" style={{paddingLeft: '0'}}>
                        <div className="container">
                            <Link to = "/admin/room_types">
                                <Button outline color="red" className="btn-add" id="btnAdd">
                                    <ImCancelCircle color="#D0211C" className="icon-top" />
                                </Button>
                            </Link>
                            <Tooltip placement="right" isOpen={this.state.tooltipOpen} target="btnAdd" toggle={()=>this.toggle()}>
                                H???y b??? thao t??c
                            </Tooltip>
                            <h3 className="text-center mt-2">??I???N TH??M TH??NG TIN LO???I PH??NG</h3>
                            <hr />
                            <div style={{height: '15px'}} />
                            <Row>
                                <Col>
                                    <Form onSubmit={this.submitRoomType} className="text-center" style={{marginRight: '15%', marginLeft: '15%', width: '70%'}}>
                                        <FormGroup row>
                                            <Label sm={3}>T??n lo???i ph??ng</Label>
                                            <Col sm={9}>
                                                <Input type="text" name="tenLP" placeholder="??i???n t??n lo???i ph??ng" required onChange={this.handleChange} autoComplete="off"/>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={3}>Lo???i h??nh ???nh: </Label>
                                            <Label style={{ marginLeft: '4%', lineHeight: '36.22px' }} check>
                                                <Input type="checkbox" onClick={this.changeStateImage} style={{ marginTop: '10px' }}/>
                                                Url/My Device
                                            </Label>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={3}>H??nh ???nh</Label>
                                            <Col sm={9}>
                                                { this.chooseImageUrlOrDevice() }
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={3}>M?? t??? gi???i thi???u</Label>
                                            <Col sm={9}>
                                                <Input 
                                                    type="text" 
                                                    name="mtGT" 
                                                    placeholder="1 v??i m?? t??? gi???i thi???u v??? ph??ng?" 
                                                    required 
                                                    onChange={this.handleChange} 
                                                    autoComplete="off"
                                                />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={3}>M?? t??? t???ng qu??t</Label>
                                            <Col sm={9}>
                                                <Input 
                                                    type="text" 
                                                    name="mtTQ" 
                                                    placeholder="1 v??i m?? t??? t???ng qu??t v??? ph??ng?" 
                                                    required 
                                                    onChange={this.handleChange} 
                                                    autoComplete="off"
                                                />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row >
                                            <Label sm={3}>S??? l?????ng ng?????i</Label>
                                            <Col sm={9}>
                                                <Label style={{ marginLeft: '-68%', marginTop:'1.1%' }} check>
                                                    <Input 
                                                        type="radio" 
                                                        onClick={(v)=>this.handleClickSlNguoi(0)} 
                                                        defaultChecked 
                                                        name="slNguoi" 
                                                        value={this.state.slNguoi}
                                                    />
                                                        1
                                                </Label>
                                                <Label style={{ marginLeft: '10%' }} check>
                                                    <Input 
                                                        type="radio" 
                                                        onClick={(v)=>this.handleClickSlNguoi(1)} 
                                                        name="slNguoi" 
                                                        value={this.state.slNguoi}
                                                    />
                                                        2
                                                </Label>
                                                <Label style={{ marginLeft: '10%' }} check>
                                                    <Input 
                                                        type="radio" 
                                                        onClick={(v)=>this.handleClickSlNguoi(2)}  
                                                        name="slNguoi" 
                                                        value={this.state.slNguoi}
                                                    />
                                                        4
                                                </Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row >
                                            <Label sm={3}>Ph??ng t???m</Label>
                                            <Col sm={9}>
                                                <Label style={{ marginLeft: '-79%', marginTop:'1.1%'  }} check>
                                                    <Input 
                                                        type="radio" 
                                                        onClick={(v)=>this.handleClickPhongTam(0)} 
                                                        defaultChecked={this.state.phongTam} 
                                                        name="phongTam" 
                                                        value="0"
                                                    />
                                                        1
                                                </Label>
                                                <Label style={{ marginLeft: '10%' }} check>
                                                    <Input 
                                                        type="radio" 
                                                        onClick={(v)=>this.handleClickPhongTam(1)} 
                                                        name="phongTam" 
                                                        value="1"
                                                    />
                                                        2
                                                </Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row >
                                            <Label sm={3}>S??? gi?????ng</Label>
                                            <Col sm={9}>
                                                <Label style={{ marginLeft: '-79%', marginTop:'1.1%'  }} check>
                                                    <Input 
                                                        type="radio" 
                                                        onClick={(v)=>this.handleClickSoGiuong(0)} 
                                                        defaultChecked name="soGiuong" 
                                                        value="0"
                                                    />
                                                        1
                                                </Label>
                                                <Label style={{ marginLeft: '10%' }} check>
                                                    <Input 
                                                        type="radio" 
                                                        onClick={(v)=>this.handleClickSoGiuong(1)} 
                                                        name="soGiuong" 
                                                        value="1"
                                                    />
                                                        2
                                                </Label>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={3}>S??? l?????ng ph??ng tr???ng</Label>
                                            <Col sm={9}>
                                                <Input 
                                                    type="number" 
                                                    name="slPhongTrong" 
                                                    placeholder="??i???n s??? l?????ng ph??ng tr???ng" 
                                                    required 
                                                    onChange={this.handleChange} 
                                                    autoComplete="off"
                                                />
                                            </Col>
                                        </FormGroup>
                                        <div style={{ height: '10vh' }}/>
                                        <Row content="text-center">
                                            <Col style={{marginLeft: '78%'}}>
                                                <Button color="warning" type="submit">Save</Button>
                                                <div className="space-15"/>
                                                <Button color="danger" type="reset">Reset</Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Col>
                            </Row>
                            
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}
