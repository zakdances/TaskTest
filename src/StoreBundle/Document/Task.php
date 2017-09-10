<?php
// src/StoreBundle/Document/Task.php
namespace StoreBundle\Document;

use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Doctrine\ODM\MongoDB\Mapping\Annotations\Id;

/**
 * @MongoDB\Document
 */
class Task
{
    /**
     * @MongoDB\Id
     */
     protected $id;
     
    /**
    * @MongoDB\Field(type="string")
    */
    protected $label;

    /**
    * @MongoDB\Field(type="date")
    */
    protected $dueDate;

    /**
    * @MongoDB\Field(type="string")
    */
    protected $status;

    /**
     * Get id
     *
     * @return id $id
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set label
     *
     * @param string $label
     * @return $this
     */
    public function setLabel($label)
    {
        $this->label = $label;
        return $this;
    }

    /**
     * Get label
     *
     * @return string $label
     */
    public function getLabel()
    {
        return $this->label;
    }

    /**
     * Set status
     *
     * @param string $status
     * @return $this
     */
    public function setStatus($status)
    {
        $this->status = $status;
        return $this;
    }

    /**
     * Get status
     *
     * @return string $status
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * Set dueDate
     *
     * @param date $dueDate
     * @return $this
     */
    public function setDueDate($dueDate)
    {
        $this->dueDate = $dueDate;
        return $this;
    }

    /**
     * Get dueDate
     *
     * @return date $dueDate
     */
    public function getDueDate()
    {
        return $this->dueDate;
    }
}
