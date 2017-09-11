<?php

namespace StoreBundle\Controller;

// src/Acme/StoreBundle/Controller/DefaultController.php
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use StoreBundle\Document\Task;
use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
use Doctrine\ODM\MongoDB\LoggableCursor;
use Doctrine\ODM\MongoDB\Mapping\Annotations\Id;
// ...

class DefaultController extends Controller
{
    /**
     * @Route("/dontgohere")
     */
    public function indexAction()
    {
        return $this->render('StoreBundle:Default:index.html.twig');
    }

    private function taskCollection() {
        
        // connect
        $m = $this->container->get('doctrine_mongodb.odm.default_connection');
        
        // select a database
        $db = $m->selectDatabase('test_database');

        // select a collection (analogous to a relational database's table)
        $collection = $db->createCollection('Task');

        return $collection;
    }

    private function allTasks() {

        // select a collection (analogous to a relational database's table)
        $collection = $this->taskCollection();

        // find everything in the collection
        $cursor = $collection->find();
        
        return iterator_to_array($cursor);
    }

    private function oneTask($id) {

        // select a collection (analogous to a relational database's table)
        // $collection = $this->taskCollection();

        // $entity = $collection->findOne(array('_id' => new \MongoId($id)));
        // $entity = $collection->find($id)->hydrate();

        $repository = $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository('StoreBundle:Task');

        $task = $repository->find($id);

        if (!$task) {
            throw $this->createNotFoundException('No task found for id '.$id);
        }

        return $task;
    }

    /**
     * @Route("/showaction")
     */
    public function showAction()
    {
        // $id = '59b34aa5c52281ab9c1d95e4';

        // find everything in the collection
        // $entity = $collection->findOne(array('_id' => new \MongoId($id)));
        
        // $task = $this->get('doctrine_mongodb')
        //     ->getRepository('StoreBundle:Task')
        //     ->find($id);
    
        // if (!$task) {
        //     throw $this->createNotFoundException('No task found for id '.$id);
        // }



        $json = (object)[
            "tasks" => $this->allTasks()
        ];

        $newResp = new JsonResponse();
        $newResp->setData($json);
        // do something, like pass the $task object into a template
        return $newResp;
    }

    /**
     * @Route("/createaction")
     */
    public function createAction(Request $request)
    {
        $data = $request->request;

        // TODO: fix nulls so there safe
        // var_dump($request->request->all());
        $id = $data->get('_id', null)['$id'];
        // $id = $id ? $id->$id : null;
        $label = $data->get('label', 'default label');
        // var_dump($data->get('dueDate', null));
        $dueDate = $data->get('dueDate', null);
        $dueDate = is_string($dueDate) ? json_decode($dueDate, true)['sec'] : $dueDate['sec'];
        // $dueDate = $dueDate ? $dueDate->sec : null;
        $status = $data->get('status', 'default status');

        $task = new Task();
        if ($id != null && $id != '') {
            $task = $this->oneTask($id);
        }

        $task->setLabel($label);
        $task->setDueDate($dueDate);
        $task->setStatus($status);
    
        $dm = $this->get('doctrine_mongodb')->getManager();
        $dm->persist($task);
        $dm->flush();
        
        $json = array(
            "tasks" => $this->allTasks()
        );

        $newResp = new JsonResponse();
        // $newResp->setContent('');
        $newResp->setData($json);
        // return new Response('Created task id '.$task->getId());
        return $newResp;
    }

    /**
     * @Route("/deleteaction")
     */
     public function deleteAction(Request $request)
     {
        $data = $request->request;

        $id = $data->get('_id', null)['$id'];

        $task = $this->oneTask($id);
        if (!$task) {
            throw $this->createNotFoundException('No task found for id '.$id);
        }

        $dm = $this->get('doctrine_mongodb')->getManager();

        $dm->remove($task);
        $dm->flush();

        $json = array(
            "tasks" => $this->allTasks()
        );

        $newResp = new JsonResponse();

        $newResp->setData($json);
        // return new Response('Created task id '.$task->getId());
        return $newResp;
     }
}

