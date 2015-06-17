<?php

namespace App\ApiModule\Presenters;

use Flame\Rest\Application\UI\RestPresenter;
use Nette,
    App\Model;


/**
 * Food presenter.
 */
class FoodPresenter extends RestPresenter
{

    public $model;

    public function startup(){
        parent::startup();
        $this->model = new Model\FoodModel($this->context->getService('dibi'));
    }

    # for POST method
    # request: /api/food
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
    # request: example.com/api/food/<id>
    public function actionRead($id = null)
    {
        try {

            $this->resource->food = $this->model->fetch($id);
        } catch (\Exception $ex) {
            $this->sendErrorResource($ex);
        }
    }

    # for GET method without @id
    # request: example.com/api/food
    public function actionReadAll()
    {

        try {
            $this->resource->foods = $this->model->fetchAll();
//            echo "<pre>";
//            var_dump($this->resource->foods);
//            echo "</pre>";
//            exit;
        } catch (\Exception $ex) {
            $this->sendErrorResource($ex);
        }
    }

    # for GET method
    # request: example.com/api/food/count
    public function actionReadCount()
    {
        try {
            $this->resource->count = 10;
        } catch (\Exception $ex) {
            $this->sendErrorResource($ex);
        }
    }

}
