import { Button, Modal, Form, InputNumber } from 'antd'
import { useState } from 'react';

function PictureSizeChangeModal({show, onHide, currentImageSize}) {
    
    const onFinish = (e) => {
        console.log(e);
        setTimeout(() => {
            onHide();
        }, 1000);
    };

    return(
        <>
        <Modal
          title="Изменение размеров изображения"
          open={show}
          footer={null}
          onCancel={onHide}
          style={{ maxWidth: 400 }}
        >
            <Form
                name="changePictureSizeForm"
                style={{ maxWidth: 400 }}
                initialValues={{ imageSize: currentImageSize }}
                autoComplete="off"
                onFinish={onFinish}
            >
                <div style={{'text-align': 'center', display: 'flex', 'flex-direction': 'row'}}>
                    <Form.Item
                    name="imageWidth"
                    >
                        <InputNumber style={{width: '165px'}} min={1} max={7680} placeholder={currentImageSize}/>
                    </Form.Item>
                    <div style={{margin: "2px 8px 0 8px" }}>x</div>
                    <Form.Item
                    name="imageLength"
                    >
                        <InputNumber style={{width: '165px'}} min={1} max={4800} placeholder={currentImageSize}/>
                    </Form.Item>
                </div>
                <Form.Item>
                    <Button block type="primary" htmlType="submit">
                        Изменить
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
      </>
    )
}

export default PictureSizeChangeModal;