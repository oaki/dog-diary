<?php

namespace App\Presenters;

use Nette,
    App\Model;


class UploadFilePresenter extends BasePresenter
{

    public function actionDefault()
    {
        $files = $this->getRequest()->getFiles();

        $arr = [];
        if(!empty($files)){

            foreach($files as $k=>$f){

                $arr = $this->saveFile($f);
            }
        }

        $this->sendResponse(
            new Nette\Application\Responses\JsonResponse($arr, "text/plain")
        );
    }

    function saveFile($f){

        $fileModel = $this->context->getService('file');
        $conf = $this->context->getParameters()['fileStorage'];

        $fileInfo = pathinfo($f->getName());

        $fileInfo['extension'] = strtolower($fileInfo['extension'] );

        $filename = self::getUniqueFilename( $conf['upload_dir'], $fileInfo['filename'], $fileInfo['extension']  );

        $f->move( $conf['upload_dir'].'/'. $filename);

        $fileId = $fileModel->insert([
            'name'=>$filename,
            'datetime'=>new \DibiDateTime()
        ]);

        $fileInfo = pathinfo($filename);

        return array(
            'id'=>$fileId,
            'filename'=>$filename
        );
    }

    private static function getUniqueFilename($dir, $name, $ext) {
        $number="";

        while(file_exists($dir.'/'.  Nette\Utils\Strings::webalize($name).$number.".".$ext)){
            ++$number;
        }

        return Nette\Utils\Strings::webalize($name).$number.'.'.$ext;
    }
}
