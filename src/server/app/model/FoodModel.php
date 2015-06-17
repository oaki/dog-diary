<?php

namespace App\Model;

class FoodModel
{

    private $connection;
    private $table = 'food';

    function __construct(\DibiConnection $db)
    {
        $this->connection = $db;
    }

    function insert($values)
    {
        $this->connection->insert($this->table, $values)->execute();
    }

    function delete($id)
    {
        $this->connection->delete($this->table)->where('id=%i', $id)->execute();
    }

    function update($values, $id)
    {
        $this->connection->update($this->table, $values)->where('id=%i', $id)->execute();
    }

    function getFluent($select_collums = '*')
    {
        return $this->connection->select($select_collums)->from($this->table);
    }

    function fetchAll()
    {
        return $this->connection->select('*')
            ->from($this->table)
            ->where('1=1')
            ->fetchAll();
    }

    function fetch($id)
    {
        return $this->getFluent()->where('id=%i', $id)->fetch();
    }
}