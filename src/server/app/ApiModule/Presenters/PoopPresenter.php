<?php

namespace App\ApiModule\Presenters;

use Flame\Rest\Application\UI\RestPresenter;
use Nette,
    App\Model;


/**
 * Poop presenter.
 */
class PoopPresenter extends RestPresenter
{

    public $model;

    public function startup(){
        parent::startup();
        $this->model = new Model\PoopModel($this->context->getService('dibi'));
    }

    # for POST method
    # request: /api/poop
    public function actionCreate()
    {

        try {
            $postData = $this->input->getData();
            $this->model->insert($postData);

        } catch (\Exception $ex) {
            $this->sendErrorResource($ex);
        }
    }

    # for GET method
    # request: example.com/api/poop/<id>
    public function actionRead($id = null)
    {
        try {

            $this->resource->poop = $this->model->fetch($id);
        } catch (\Exception $ex) {
            $this->sendErrorResource($ex);
        }
    }

    # for GET method without @id
    # request: example.com/api/poop
    public function actionReadAll()
    {

        try {
            $this->resource->poops = $this->model->fetchAll();
        } catch (\Exception $ex) {
            $this->sendErrorResource($ex);
        }
    }

    # for GET method
    # request: example.com/api/poop/count
    public function actionReadCount()
    {
        try {
            $this->resource->count = 10;
        } catch (\Exception $ex) {
            $this->sendErrorResource($ex);
        }
    }

}
