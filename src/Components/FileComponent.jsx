import { Button, Table, Popover, Dropdown, Upload, message, Modal } from 'antd'
import { useState } from 'react';
import { useQuery } from 'react-query';
import { FilePopup } from '../Popup';
import { UploadOutlined, FileOutlined } from '@ant-design/icons';

const props = {
        action: '/api/file-server/',
        method: 'POST',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        customRequest: ({onSuccess, onError, file}) => {
            let data = {
                "name": file.name,
                "comment": ""
            }
            //console.log(data);
            fetch('/api/file-server/', {
                method: 'POST',
                body: JSON.stringify(data),
                success: (resp) => {
                    console.log(resp);
                    onSuccess(file)
                },
                failure: (err) => {
                    const error = new Error(err)
                    onError({event: error})
                }
            })
        }
    };

function FileComponent() {
    const [dataSource, setDataSource] = useState([])
    const [columns, setColumns] = useState([])
    const [popupState, setPopupState] = useState({
        record: {},
        visible: false, 
        img: false,
        x: 0,
        y: 0
    })

    //reactQuery для получения данных о файлах
    const data = useQuery('files', fetchFiles, {
        refetchInterval: 5000,
      });

    async function fetchFiles() {
        //const response = await fetch('https://jsonplaceholder.typicode.com/photos');
        const response = await fetch('tempFileServ.json');
        const data =  await response.json();
        const tempDataSource = []
    
        //console.log(data);

        const tempColumns = [
            {
                title: "Name",
                dataIndex: "name",
                key: "name"
            },
            {
                title: "Extension",
                dataIndex: "extension",
                key: "extension"
            },
            {
                title: "Size",
                dataIndex: "size",
                key: "size"
            },
            {
                title: "Comment",
                dataIndex: "comment",
                key: "comment"
            },
        ]

        // for (let objKey of Object.keys(data[0])) {
        //     let tempObj = {
        //         title: objKey.charAt(0).toUpperCase() + objKey.slice(1),
        //         dataIndex: objKey,
        //         key: objKey,
        //     }
            
        //     //ссылка на файл
        //     if (objKey === 'url') {
        //         tempObj.render = text => <Button icon={<FileOutlined />} href={text} target="_blank"></Button>
        //     }
        //     tempColumns.push(tempObj)
        // }
        data.forEach(el => {
            let tempObj = {
                "name": el.name,
                "extension": el.extension,
                "size": el.size,
                "comment": el.comment
            }
            tempDataSource.push(tempObj);
        });
    
        // console.log(columns);
        // console.log(dataSource);
    
        setDataSource(tempDataSource);
        setColumns(tempColumns);

        return data;
    }

    function onRowRightClick(record, index, event) {
        event.preventDefault();
        
        if (!popupState.visible) {
            document.addEventListener(`click`, function onClickOutside() {
            setPopupState({
                record,
                visible: false,
                x: event.clientX,
                y: event.clientY
            })
            document.removeEventListener(`click`, onClickOutside)
            })
        }

        //console.log(record);

        //Через react query по fileId ищем файл и загоняем его данные в record

        if (record.id != 1) {
            setPopupState({
                record,
                visible: true,
                img: true,
                x: event.clientX,
                y: event.clientY
            })
        }
        else {
            setPopupState({
                record,
                visible: true,
                img: false,
                x: event.clientX,
                y: event.clientY
            })
        }
        //console.log(popupState)
        event.stopPropagation();
    }

    return (
        <>
            <Upload {...props}>
                <Button icon={<UploadOutlined />} style={{marginBottom: '7px'}}>Загрузить файл</Button>
            </Upload>
            <Table  
                dataSource={dataSource} columns={columns}
                pagination={{
                    pageSizeOptions : ['5', '10', '30', '50', '100'], 
                    showSizeChanger : true ,
                    defaultPageSize: 5
                }}
                onRow={(record, rowIndex) => {
                    return {
                        onContextMenu: onRowRightClick.bind(this, record, rowIndex)
                    };
                }}    
            />
            <FilePopup {...popupState}/>
        </>
    );
}

export default FileComponent;