import axios from 'axios';
import React, { useState } from 'react';
import { useEffect, useRef} from 'react';
import Cookies from 'universal-cookie';

export default function Test() {
    const [selectedFile, setSelectedFile] = useState(null)
    const [staff, setStaff] = useState({})
    const [isLogin, setIsLogin] = useState(false)
    const loginForm = useRef(null);
    const sendImageForm = useRef(null);
    const cookies = new Cookies();
    const [photo, setPhoto] = useState(null);
    
    
    

    const onSendSuccess = async () => {
            await axios({
                method: 'get',
                url: 'http://localhost:3000/api/v1/admin/staff',
                withCredentials: true,
                headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
            })
            .then(function (response) {
                setStaff(response.data.rows[0])
            });
    }

    
    const handleSubmitForm = (e) => {
        e.preventDefault();
        const form = loginForm.current;
        const email = form['email'].value;
        const password = form['password'].value;
        const data = {
            email:email,
            password:password
        }

        axios({
            method: 'post',
            url: 'http://localhost:3000/api/v1/login',
            data: data
        })
        .then(function (response) {
            const token = response.data.token
            cookies.set('token', token );
            setIsLogin(true)
        });
    }


    const fileSelectedHandler = (e) => {
        setSelectedFile(e.target.files[0])
    }


    const handleSendImage = async (e) => {
        e.preventDefault();
        const formImage = sendImageForm.current;
        const email = formImage['email'].value;
        const password = formImage['password'].value;
        const fullName = formImage['fullName'].value;
        const staffId = formImage['staffId'].value;
        const phoneNumber = formImage['phoneNumber'].value;
        const avatar = formImage['avatar'].value;
        const city = formImage['city'].value;
        const district = formImage['district'].value;
        const wards = formImage['wards'].value;
        const role = formImage['role'].value;

        const fd = new FormData();
        fd.append('avatar', selectedFile, selectedFile.name)
        fd.append('email', email)
        fd.append('password', password)
        fd.append('fullName', fullName)
        fd.append('staffId', staffId)
        fd.append('phoneNumber', phoneNumber)
        fd.append('city', city)
        fd.append('district', district)
        fd.append('wards', wards)
        fd.append('role', role) 

        await axios({
            method: "post",
            url: "http://localhost:3000/api/v1/admin/staff/insert",
            data: fd,
            withCredentials: true,
            headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
            })
            .then(function (response) {
                //handle success
                onSendSuccess()
            })
            .catch(function (response) {
                //handle error
                console.log(response);
        });
    }


    

  return <div>
      <div className="App">
          <h1>Đăng nhập</h1>
        <form method='post' ref={loginForm} >
            <p>Email:</p>
            <input type="text" name='email'/>
            <p>Mật khẩu:</p>
            <input type="text" name='password'/>
            <input type="submit" onClick={handleSubmitForm}/>
        </form>


        <div>
            -------------------------------------
            <form method='post' ref={sendImageForm} >
            <p>email</p>
            <input type="text" name='email'/>
            <p>password</p>
            <input type="text" name='password'/>
            <p>fullName</p>
            <input type="text" name='fullName'/>
            <p>staffId</p>
            <input type="text" name='staffId'/>
            <p>phoneNumber</p>
            <input type="text" name='phoneNumber'/>
            <p>avatar</p>
            <input type="file" name='avatar' onChange={fileSelectedHandler}/>
            <p>city</p>
            <input type="text" name='city'/>
            <p>district</p>
            <input type="text" name='district'/>
            <p>wards</p>
            <input type="text" name='wards'/>
            <p>role</p>
            <input type="text" name='role'/>
            <input type="submit" onClick={handleSendImage}/>
        </form>
        </div>
    </div>

    <h1>Bộ sưu tập</h1>
    <p>Name: {staff.fullName}</p>
    <img src ={staff.avatar ? `http://localhost:3000/${staff.avatar}` : ''} alt=""/>
  </div>;
}
