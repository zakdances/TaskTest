<?php

namespace StoreBundle\Controller;

// src/Acme/StoreBundle/Controller/DefaultController.php
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
// use Symfony\Component\Validator\Constraints\DateTime;
use \DateTime;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
// use StoreBundle\Document\Task;
use StoreBundle\Entity\Task_mysql;
// use Doctrine\ODM\MongoDB\Mapping\Annotations as MongoDB;
// use Doctrine\ODM\MongoDB\LoggableCursor;
// use Doctrine\ODM\MongoDB\Mapping\Annotations\Id;
use Doctrine\ORM\EntityManagerInterface;
// ...

class DefaultController extends Controller
{

    public $dbType = 'mysql';

    /**
     * @Route("/dontgohere")
     */
    public function indexAction()
    {
        return $this->render('StoreBundle:Default:index.html.twig');
    }

    // private function taskCollection() {
        
    //     // connect
    //     $m = $this->container->get('doctrine_mongodb.odm.default_connection');
        
    //     // select a database
    //     $db = $m->selectDatabase('test_database');

    //     // select a collection (analogous to a relational database's table)
    //     $collection = $db->createCollection('Task');

    //     return $collection;
    // }

    private function allTasks() {

        $all = [];

        if ($this->dbType == 'mongodb') {
            // select a collection (analogous to a relational database's table)
            // $collection = $this->taskCollection();
        
            // find everything in the collection
            // $cursor = $collection->find();

            // $all = iterator_to_array($cursor);
        } else if ($this->dbType == 'mysql') {

            $all = $this->getDoctrine()
                ->getRepository(Task_mysql::class)
                // ->getRepository('StoreBundle:Task_mysql')
                ->findAll();
    
            //
        }
        
        if (!$all) {
            throw $this->createNotFoundException(
                'No tasks found.'
            );
        }

        return $all;
    }

    private function oneTask($id) {
        $task = null;
        // select a collection (analogous to a relational database's table)
        // $collection = $this->taskCollection();

        // $entity = $collection->findOne(array('_id' => new \MongoId($id)));
        // $entity = $collection->find($id)->hydrate();
        if ($this->dbType == 'mongodb') {
            // $repository = $this->get('doctrine_mongodb')
            //     ->getManager()
            //     ->getRepository('StoreBundle:Task');

            // $task = $repository->find($id);
        } else if ($this->dbType == 'mysql') {

            $repository = $this->getDoctrine()->getRepository(Task_mysql::class);

            $task = $repository->find($id);
        }

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

        $tasks = $this->allTasks();
        
        $json = (object)[
            "tasks" => $this->serializer()->serialize($tasks, 'json')
        ];
        // $json = $this->serializer()->serialize($json, 'json');
        // var_dump($json);
        
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
        $id = $data->get('id', null);
        // $id = is_string($id) ? json_decode($id, true)['$id'] : $id['$id'];
        // $id = $id ? $id->$id : null;
        $label = $data->get('label', 'default label');
        // var_dump($data->get('dueDate', null));
        $dueDateUnix = $data->get('dueDate', null);
        
        // $dueDateUnixSeconds = is_string($dueDateUnixSeconds) ? json_decode($dueDateUnixSeconds, true)['sec'] : $dueDateUnixSeconds['sec'];
        
        
        // $dueDate = $dueDate ? $dueDate->sec : null;
        $status = $data->get('status', 'default status');

        $task = $this->dbType == 'mongodb' ? new Task() : new Task_mysql();

        if ($id != null && $id != '') {
            $task = $this->oneTask($id);
        }

        $date = new DateTime();
        $date->setTimestamp($dueDateUnix);
        // var_dump($date);

        $task->setLabel($label);
        $task->setDueDate($date);
        $task->setStatus($status);
        

        if ($this->dbType == 'mongodb') {
            // $this->createaction_mongodb($task);
        } else if ($this->dbType == 'mysql') {
            $this->createaction_mysql($task);
        }
        
        
        $tasks = $this->allTasks();
        
        $json = (object)[
            "tasks" => $this->serializer()->serialize($tasks, 'json')
        ];

        $newResp = new JsonResponse();
        // $newResp->setContent('');
        $newResp->setData($json);
        // return new Response('Created task id '.$task->getId());
        return $newResp;
    }

    // private function createaction_mongodb(Task $task)
    // {
    //     $dm = $this->get('doctrine_mongodb')->getManager();
    //     $dm->persist($task);
    //     $dm->flush();
    // }

    private function createaction_mysql(Task_mysql $task)
    {
        // you can fetch the EntityManager via $this->getDoctrine()
        // or you can add an argument to your action: createAction(EntityManagerInterface $em)
        $em = $this->getDoctrine()->getManager();
    
        // tells Doctrine you want to (eventually) save the Task (no queries yet)
        $em->persist($task);
    
        // actually executes the queries (i.e. the INSERT query)
        $em->flush();
    }

    /**
     * @Route("/deleteaction")
     */
     public function deleteAction(Request $request)
     {
        // $data = $request->request;

        // $id = $data->get('_id', null)['$id'];

        // $task = $this->oneTask($id);
        // if (!$task) {
        //     throw $this->createNotFoundException('No task found for id '.$id);
        // }

        // $dm = $this->get('doctrine_mongodb')->getManager();

        // $dm->remove($task);
        // $dm->flush();

        // $json = array(
        //     "tasks" => $this->allTasks()
        // );

        $newResp = new JsonResponse();

        // $newResp->setData($json);
        // return new Response('Created task id '.$task->getId());
        return $newResp;
     }

     public function serializer() {
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        
        $serializer = new Serializer($normalizers, $encoders);

        return $serializer;
     }
}

