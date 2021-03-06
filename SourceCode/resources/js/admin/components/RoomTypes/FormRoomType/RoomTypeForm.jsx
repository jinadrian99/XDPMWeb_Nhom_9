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
import NavbarTop from '../../Navigation/NavbarTop/NavbarTop';
import SidebarLeft from '../../Navigation/Sidebar/SidebarLeft';
import { ImCancelCircle } from "react-icons/im";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { link } from '../../../../link';
const http = link;

export default class RoomTypeForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idLP:'',
            tenLP: '',
            hinhAnh: '',
            moTa: '',
            mtGT:'',
            mtTQ:'',
            slNguoi: '',
            phongTam: '',
            soGiuong: '',
            slPhongTrong: '',
            imgRaw: '',

            chooseImageUrl: false,
            tooltipOpen: false
        };
        this.findRoomTypeByID = this.findRoomTypeByID.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClickSlNguoi = this.handleClickSlNguoi.bind(this);
        this.handleClickSoGiuong = this.handleClickSoGiuong.bind(this);
        this.handleClickPhongTam = this.handleClickPhongTam.bind(this);
        this.fileSelectHandle = this.fileSelectHandle.bind(this);
        this.changeStateImage = this.changeStateImage.bind(this);
        this.saveChange = this.saveChange.bind(this);
    }

    componentWillMount(){
        const idLoaiPhong = +this.props.match.params.id;
        if (idLoaiPhong) {
           this.findRoomTypeByID(idLoaiPhong);
        }
    }

    undoPages(){
        return this.props.history.push("/admin/room_types");
    }

    findRoomTypeByID(id){
        axios.get(http + '/api/room_types/' + id).then(res => {
            if (res.data != null) {
                this.setState({
                    idLP: res.data.idLP,
                    tenLP: res.data.tenLP,
                    hinhAnh: res.data.hinhAnh,
                    imgRaw: res.data.hinhAnh,
                    moTa: JSON.parse(res.data.moTa),
                    slPhongTrong: res.data.slPhongTrong
                },()=>{
                    if (this.state.moTa != null) {
                        this.setState({
                            mtGT: this.state.moTa[0],
                            mtTQ: this.state.moTa[1],
                            slNguoi: this.state.moTa[2],
                            phongTam: this.state.moTa[3],
                            soGiuong: this.state.moTa[4]
                        });
                    }
                    console.log(this.state.mtGT);
                });
            }
        }).catch((err)=>{
            console.log('Error: ' + err);
        });
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
            [e.target.name]: e.target.value
        });
    }

    changeStateImage(){
        console.log(this.state.chooseImageUrl);
        this.setState({
            chooseImageUrl: !this.state.chooseImageUrl
        });
    }

    chooseImageUrlOrDevice(){
        if(this.state.chooseImageUrl){
            return <Input type="file" name="hinhAnh" onChange={this.fileSelectHandle} defaultValue={this.state.hinhAnh} multiple/>;
        } else {
            return <Input type="text" name="hinhAnh" onChange={this.handleChange} defaultValue={this.state.hinhAnh}/>;
        }
    }

    fileSelectHandle(e){
        this.setState({
            hinhAnh: e.target.files
        });
        console.log(e.target.files);
    }

    saveChange(e){
        // MoTa
        var des = [];
        des.push(this.state.mtGT);
        des.push(this.state.mtTQ);
        des.push(this.state.slNguoi);
        des.push(this.state.phongTam);
        des.push(this.state.soGiuong);

        des = JSON.stringify(des);

        console.log(this.state.hinhAnh, this.state.imgRaw);
        if(this.state.hinhAnh === this.state.imgRaw){
            this.setState({
                moTa: des
            },()=>{
                console.log("UpLoad DB Hinh cu: ", this.state);
                // upload to db
                const roomType = {
                    idLP: this.state.idLP,
                    tenLP: this.state.tenLP,
                    hinhAnh: this.state.hinhAnh,
                    moTa: this.state.moTa,
                    slPhongTrong: this.state.slPhongTrong
                }
                delete roomType.chooseImageUrl;
                delete roomType.tooltipOpen;
                console.log('hinh anh:' , roomType.hinhAnh);
                console.log('value room: ',roomType);
                if (window.confirm('Are you sure ?')) {
                    axios.put(http + '/api/room_types/'+roomType.idLP, roomType).then(res => {
                        if (res.data != null) {
                            setTimeout(()=>this.undoPages(),1000);
                        }
                    })
                }
            });
        }
        else if (this.state.hinhAnh !== this.state.imgRaw) {
            // delete file old
            var data = {
                imgRaws: this.state.imgRaw
            };
            axios.post(http + '/api/room_types_delete_file',data).then(res=>{
                if(res.data)
                    console.log('???? x??a h??nh c??');
                else
                    console.log('Kh??ng c?? h??nh c??');
            })
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

                console.log(imgsraw);
                var imgs = [];
                for (let i = 0; i < imgsraw.length; i++) {
                    imgs.push('/image/'+imgsraw[i]);
                }
                console.log(imgs);
                imgs = JSON.stringify(imgs);

                this.setState({
                    hinhAnh: imgs
                }, ()=>{
                    this.setState({
                        moTa: des
                    },()=>{
                        console.log("UpLoad DB Hinh moi: ", this.state);
                        // upload to db
                        const roomType = {
                            idLP: this.state.idLP,
                            tenLP: this.state.tenLP,
                            hinhAnh: this.state.hinhAnh,
                            moTa: this.state.moTa,
                            slPhongTrong: this.state.slPhongTrong
                        }
                        delete roomType.chooseImageUrl;
                        delete roomType.tooltipOpen;
                        console.log('hinh anh:' , roomType.hinhAnh);
                        console.log('value room: ',roomType);
                        if (window.confirm('Are you sure ?')) {
                            axios.put(http + '/api/room_types/'+roomType.idLP, roomType).then(res => {
                                if (res.data != null) {
                                    setTimeout(()=>this.undoPages(),1000);
                                }
                            })
                        }
                    });
                });
                console.log(this.state.hinhAnh);
            }).catch(err=>{
                console.log(err);
            })
        }
        // var des = [];
        // des.push(this.state.mtGT);
        // des.push(this.state.mtTQ);
        // des.push(this.state.slNguoi);
        // des.push(this.state.phongTam);
        // des.push(this.state.soGiuong);

        // des = JSON.stringify(des);

        // this.setState({
        //     moTa: des
        // },()=>{
        //     console.log("UpLoad DB: ", this.state);
        //     // upload to db
        //     const roomType = {
        //         idLP: this.state.idLP,
        //         tenLP: this.state.tenLP,
        //         hinhAnh: this.state.hinhAnh,
        //         moTa: this.state.moTa,
        //         slPhongTrong: this.state.slPhongTrong
        //     }
        //     delete roomType.chooseImageUrl;
        //     delete roomType.tooltipOpen;
        //     console.log('hinh anh:' , roomType.hinhAnh);
        //     console.log('value room: ',roomType);
        //     if (window.confirm('Are you sure ?')) {
        //         axios.put(http + '/api/room_types/'+roomType.idLP, roomType).then(res => {
        //             if (res.data != null) {
        //                 setTimeout(()=>this.undoPages(),1000);
        //             }
        //         })
        //     }
        // });
        
    }

    toggle(){
        this.setState({
            tooltipOpen : !this.state.tooltipOpen
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
                                <Button outline color="white" className="btn-add" id="btnAdd">
                                    <ImCancelCircle color="#D0211C" className="icon-top" />
                                </Button>
                            </Link>
                            <Tooltip placement="right" isOpen={this.state.tooltipOpen} target="btnAdd" toggle={()=>this.toggle()}>
                                H???y b??? thao t??c
                            </Tooltip>
                            <h3 className="text-center mt-2">S???A TH??NG TIN LO???I PH??NG</h3>
                            <hr />
                            <div style={{height: '15px'}} />
                            <Row>
                                <Col>
                                    <Form  className="text-center" style={{marginRight: '15%', marginLeft: '15%', width: '70%'}}>
                                        <FormGroup row>
                                            <Label sm={3}>T??n lo???i ph??ng</Label>
                                            <Col sm={9}>
                                                <Input 
                                                    type="text" 
                                                    name="tenLP" 
                                                    placeholder="??i???n t??n lo???i ph??ng" 
                                                    onChange={this.handleChange} 
                                                    value={this.state.tenLP} 
                                                    autoComplete="off"
                                                />
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={3}>Lo???i h??nh ???nh: </Label>
                                            <Label  style={{ marginLeft: '4%', lineHeight: '36.22px' }} check>
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
                                                    value={this.state.mtGT} 
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
                                                    value={this.state.mtTQ} 
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
                                                        name="slNguoi" 
                                                        value="0"
                                                    />
                                                        1
                                                </Label>
                                                <Label style={{ marginLeft: '10%' }} check>
                                                    <Input 
                                                        type="radio" 
                                                        onClick={(v)=>this.handleClickSlNguoi(1)} 
                                                        name="slNguoi" 
                                                        value="1"
                                                    />
                                                        2
                                                </Label>
                                                <Label style={{ marginLeft: '10%' }} check>
                                                    <Input 
                                                        type="radio" 
                                                        onClick={(v)=>this.handleClickSlNguoi(2)} 
                                                        name="slNguoi" 
                                                        value="2"     
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
                                                        name="soGiuong" 
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
                                                    onChange={this.handleChange} 
                                                    value={this.state.slPhongTrong} 
                                                    autoComplete="off"
                                                />
                                            </Col>
                                        </FormGroup>
                                        <div style={{ height: '10vh' }}/>
                                        <Row content="text-center">
                                            <Col style={{marginLeft: '77%'}}>
                                                <Button color="warning" onClick = {()=>this.saveChange()}>Update</Button>
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
