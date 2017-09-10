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

    private function allTasks() {
        
        // connect
        $m = $this->container->get('doctrine_mongodb.odm.default_connection');

        // select a database
        $db = $m->selectDatabase('test_database');

        // select a collection (analogous to a relational database's table)
        $collection = $db->createCollection('Task');

        // find everything in the collection
        $cursor = $collection->find();
        
        return iterator_to_array($cursor);
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
        // var_dump($request->request->all());
        $label = $request->request->get('label', 'default label');
        $dueDate = $request->request->get('dueDate', 'default due date');
        $status = $request->request->get('status', 'default status');

        $task = new Task();
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
}

